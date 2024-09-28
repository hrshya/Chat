import { supabase } from "@/lib/supabaseClient";
import React from "react";

interface EditMessageProps {
  editContent: string;
  setEditContent: (content: string) => void;
  messageId: string | null; 
  setSelectedMessageId: (id: string | null) => void; 
  saveEdit: () => void
}

const EditMessage: React.FC<EditMessageProps> = ({ editContent, setEditContent, messageId, setSelectedMessageId, saveEdit }) => {
  
  
  const save = async () => {
    if (!messageId) {
      console.error("Message ID is undefined.");
      return; 
    }

    try {
      console.log("Editing message with ID:", messageId);

      
      const versionNumber = await getNextVersionNumber(messageId); 

      const { data: versionData, error: versionError } = await supabase
        .from("message_versions")
        .insert({ message_id: messageId, version_content: editContent, version_number: versionNumber });

      if (versionError) throw new Error(versionError.message);

      
      const { error: updateError } = await supabase
        .from("messages")
        .update({ content: editContent })
        .eq("id", messageId);

      if (updateError) throw new Error(updateError.message);

      console.log("Message updated successfully");
      setSelectedMessageId(null);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  
  const getNextVersionNumber = async (messageId: string): Promise<number> => {
    const { data, error } = await supabase
      .from("message_versions")
      .select("version_number")
      .eq("message_id", messageId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching version number:", error);
      return 1;
    }

    return (data?.version_number || 0) + 1; 
  };

  return (
    <div className="flex flex-col gap-2 mt-4 mb-4">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full bg-slate-200 rounded-xl p-4 pl-8" 
      />
      <button onClick={()=>{save(); saveEdit();}} className="p-2 text-white bg-black rounded-full">
        Save
      </button>
    </div>
  );
};

export default EditMessage;
