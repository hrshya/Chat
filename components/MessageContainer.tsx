import React, { useState } from "react";
import EditMessage from "./EditMessage";
import { MessageType } from "@/lib/types/Message";

interface MessageContainerProps {
  messages: MessageType[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages }) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEditClick = (messageId: string, currentContent: string) => {
    console.log("Selected Message ID:", messageId);
    setSelectedMessageId(messageId);
    setEditContent(currentContent);
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
          <button onClick={() => handleEditClick(message.id, message.content)}>Edit</button>
        </div>
      ))}
      {selectedMessageId && (
        <EditMessage
          editContent={editContent}
          setEditContent={setEditContent}
          messageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId} 
          saveEdit={function (): void {
            throw new Error("Function not implemented.");
          } }          
        />
      )}
    </div>
  );
};

export default MessageContainer;
