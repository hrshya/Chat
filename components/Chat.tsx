"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EditMessage from "./EditMessage";
import { MessageType } from "@/lib/types/Message";
import { editMessage } from "./branch";
import MessageVersions from "./MessageVersions";
import FollowUpMessages from "./FollowUp";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<MessageType | null>(null);
  const [conversationId, setConversationId] = useState<string | null>("");
  const [messageId, setMessageId] = useState<string | null>("");
  const [parentId, setParentId] = useState<string | null>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const user =  await supabase.auth.getUserIdentities();
      console.log(user);
      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMessage = payload.new as MessageType;
        setMessages((prev) => [...prev, newMessage]);
        setMessageId(newMessage.id); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isEditing]);

  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    try {
      const convoId = await supabase.from("conversations").select("id").single();
      const conId = convoId.data?.id;
      setConversationId(conId);

      const PareId = await supabase.from("messages").select("parent_message_id").limit(1).single();
      const PaId = PareId.data?.parent_message_id;

      const sequenceNumber = await getNextVersionNumber(PaId);

      if (newMessage.trim()) {
        if (PaId) {
          const { error: messageError } = await supabase
            .from("messages")
            .insert({
              content: newMessage,
              conversation_id: conId,
              parent_message_id: PaId,
            });

          if (messageError) {
            console.error("Error sending message:", messageError);
            return;
          }

          const { data: existingBranch } = await supabase
            .from("branches")
            .select("id")
            .eq("parent_id", PaId)
            .eq("sequence", sequenceNumber)
            .maybeSingle();

          if (!existingBranch) {
            const { data, error: branchError } = await supabase
              .from("branches")
              .insert({
                parent_id: PaId,
                branch_content: newMessage,
                sequence: sequenceNumber,
              });

            if (branchError) {
              console.error("Error inserting into branches:", branchError);
              return;
            }
          }
        } else {
          const { data, error: noParentError } = await supabase
            .from("messages")
            .insert({
              content: newMessage,
              conversation_id: conId,
            });

          if (noParentError) {
            console.error("Error sending message without parent:", noParentError);
            return;
          }
        }
        
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error in sendMessage function:", error);
    }
  };

  const getNextVersionNumber = async (parent_Id: string | null): Promise<number> => {
    try {
      if (!parent_Id) return 1; 
      
      const { data, error } = await supabase
        .from("branches")
        .select("sequence")
        .eq("parent_id", parent_Id)
        .order("sequence", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching version number:", error);
        return 1;
      }

      return (data?.sequence || 0) + 1; 
    } catch (error) {
      console.error("Error in getNextVersionNumber function:", error);
      return 1; 
    }
  };

  const startEditing = async (message: MessageType) => {
    setIsEditing(true);
    setEditingMessage(message);
    setEditContent(message.content);
    setMessageId(message.id);
    const parId = await supabase.from("messages").select("parent_message_id").eq("id", message.id).single();
    const finalParId = parId.data?.parent_message_id;
    setParentId(finalParId);
  };

  const saveEdit = async () => {
    if (editingMessage && editingMessage.id) {
      await editMessage(Number(editingMessage.id), editContent);
      setIsEditing(false);
      setEditingMessage(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="overflow-y-auto max-h-[500px]">
        <MessageList messages={messages} onEditClick={startEditing} />
        <div ref={messagesEndRef} />
      </div>
    
      {editingMessage && (
        <div className="flex justify-between bg-cyan-50 p-4 rounded-xl">
          <MessageVersions messageId={editingMessage.id} />
          <FollowUpMessages originalMessageId={parentId} />
        </div>
      )}
      {isEditing && (
        <EditMessage 
          editContent={editContent} 
          setEditContent={setEditContent} 
          messageId={messageId}
          setSelectedMessageId={setMessageId}
          saveEdit={saveEdit}
        />
      )}
      <MessageInput 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        sendMessage={sendMessage} 
      />
    </div>
  );
};

export default Chat;
