import { supabase } from "@/lib/supabaseClient";
import React, { Key, ReactNode, useEffect, useState } from "react";

interface Message {
  id: Key | null | undefined;
  created_at: String;
  branch_content: ReactNode;
}

const MessageBranches: React.FC<{ originalMessageId: string | null }> = ({
  originalMessageId,
}) => {
  const [versions, setVersions] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessageBranches = async () => {
      if (!originalMessageId) return; 

      const { data: versionData, error: versionError } = await supabase
        .from("branches")
        .select("*")
        .eq("parent_id", originalMessageId)
        .order("sequence", { ascending: false });

      if (versionError) {
        console.error("Error fetching message versions:", versionError);
        return;
      }

      console.log("Fetched Versions:", versionData);
      setVersions(versionData || []);
    };

    fetchMessageBranches();
  }, [originalMessageId]);

  return (
    <div>
      <h4 className="text-2xl font-semibold mb-2">Message Branches</h4>
      {versions.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        versions.map((version) => (
          <div key={version.id} className="message-branch ml-4 mb-2 text-black"> {/* Changed to version.id for unique key */}
            <p>
              {version.branch_content}
            </p>
            {/* @ts-ignore */}
            <small>{new Date(version.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageBranches;
