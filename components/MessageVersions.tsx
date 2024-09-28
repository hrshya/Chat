import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";

interface MessageVersionsProps {
    messageId: string;
}

const MessageVersions: React.FC<MessageVersionsProps> = ({ messageId }) => {
    const [versions, setVersions] = useState<any[]>([]);

    useEffect(() => {
        const fetchVersions = async () => {
            const { data, error } = await supabase
                .from("message_versions")
                .select("*")
                .eq("message_id", messageId)
                .order("version_number", { ascending: false });

            if (error) {
                console.error("Error fetching message versions:", error);
            } else {
                setVersions(data);
            }
        };

        fetchVersions();
    }, [messageId]);

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Previous Versions</h3>
            {versions.map((version) => (
                <div key={version.id} className="ml-4 mb-2">
                    <p>{version.version_content}</p>
                    <small>{new Date(version.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default MessageVersions;
