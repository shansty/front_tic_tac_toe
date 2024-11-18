import Button from '../../utilsComponent/Button.tsx';
import React, { useState, useRef, useEffect } from 'react';
import './Chat.css'; 

interface ChatMessage {
    userId: string;
    text: string;
  }

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userId = 'user123';

    const handleSendMessage = () => {
        const newMessage: ChatMessage = { userId, text: inputMessage };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');
        scrollToBottom();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return (
        <div className="chat-container">
        <div className="messages-container">
            {messages.map((message, index) => (
            <p key={index} className="message">
                <strong>{message.userId}:</strong> {message.text}
            </p>
            ))}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="input-container">
            <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="message-input"
            />
            <Button width='150px' className="send-button" onClick={handleSendMessage}>Send Message</Button>
        </div>
        </div>
    );
};

export default Chat;