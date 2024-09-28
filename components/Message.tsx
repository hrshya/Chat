import React from "react";
import { MessageType } from "@/lib/types/Message";

interface MessageProps {
  message: MessageType;
  onEditClick: (message: MessageType) => void;
}

const Message: React.FC<MessageProps> = ({ message, onEditClick }) => {
  return (
    <div className="flex justify-between items-center w-80 p-4 rounded-xl bg-slate-100 mb-2">
      <div className="text-black">{message.content}</div>
      <button onClick={() => onEditClick(message)} className="p-2 text-slate-600 px-2 rounded-full bg-slate-300 hover:bg-black hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </button>
    </div>
  );
};

export default Message;
