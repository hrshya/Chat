import React from "react";
import Message from "./Message";
import { MessageType } from "@/lib/types/Message";

interface MessageListProps {
  messages: MessageType[];
  onEditClick: (message: MessageType) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onEditClick }) => {
  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} onEditClick={onEditClick} />
      ))}
    </div>
  );
};

export default MessageList;
