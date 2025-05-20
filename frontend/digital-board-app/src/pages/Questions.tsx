import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket'; // ⬅️ Import the shared socket instance

interface Message {
  text: string;
  author: string;
  timestamp: string;
}

const Questions: React.FC<{ user: { name: string; email: string } }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Listen for initial chat history
  //   socket.on('chat-history', (msgs: Message[]) => {
  //     console.log(msgs);
  //     setMessages(msgs);
  //   });

  //   // Listen for new messages
  //   socket.on('receive-message', (msg: Message) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   return () => {
  //     socket.off('chat-history');
  //     socket.off('receive-message');
  //   };
  // }, []);

  useEffect(() => {
    // Ask server for the chat history when component mounts
    socket.emit('get-history');

    socket.on('chat-history', (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on('receive-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat-history');
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);


  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('new-message', {
        text: input,
        author: user.name,
        timestamp: new Date().toISOString(),
      });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border shadow rounded p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Live Chat</h2>
      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 p-2 rounded-md shadow-sm">
            <div className="text-sm text-blue-600 font-semibold">{msg.author}</div>
            <div>{msg.text}</div>
            <div className="text-xs text-right text-gray-500">
              {new Date(msg.timestamp).toLocaleString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </div>
          </div>
        ))}
      </div>
      <textarea
        rows={3}
        className="mt-4 p-2 border rounded w-full resize-none"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
      />
      <button onClick={sendMessage} className="mt-2 self-end bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
};

export default Questions;
