export type MessageType = {
    id: string;
    content: string;
    created_at: string;
    is_edited?: boolean;
    parent_message_id?: string | null;
    conversation_id?: string;
};