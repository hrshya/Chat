import React from "react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, sendMessage }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full items-center w-[680px] mb-8 gap-2">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message"
        className="w-full bg-slate-200 rounded-full p-4 pl-4"
      />
      <button onClick={() => { sendMessage();  }} className="h-12 w-12 flex items-center justify-center text-white bg-black rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;
