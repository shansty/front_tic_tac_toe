import React, { useState, useRef, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import Button from '../../utilsComponent/Button.tsx';
import { getToken, getIDFromToken } from '../../../utils.ts';
import { getUserRoleForChat } from '../../../axios.ts';
import './Chat.css'; 

interface ChatMessage {
    message: string;
    sender: string;
  }

  interface ChatProps {
    gameId?: string;
}  

const gameChatSocket = io("http://localhost:3002/game_chat", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
}) as Socket;  

const Chat: React.FC<ChatProps> = ({ gameId }) => {

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [sender, setSender] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const token = getToken();
    const userId = getIDFromToken(token);

    useEffect(() => {
        getUserRoleForChat(gameId as string, userId, token, setSender)
        gameChatSocket.emit("start_chat", userId)
    }, [])    
    

    useEffect(() => {
        gameChatSocket.on("receive_message", (message: ChatMessage) => {
            console.log("receive_message.start")
            console.dir({messages, message})
            setMessages([...messages, message]);
        });
        scrollToBottom();
        return () => {
            gameChatSocket.off("receive_message");
        };
    }, [messages]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const handleSendMessage = () => {
        console.log(`inputMwssage    ${inputMessage}`)
        gameChatSocket.emit("send_message", sender, userId, gameId, inputMessage)
        setInputMessage('');
        scrollToBottom();
    };

    
    return (
        <div className="chat-container">
        <div className="messages-container">
            {messages.map((message, index) => (
            <p key={index} className="message">
                <strong>{message.sender}:</strong> {message.message}
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