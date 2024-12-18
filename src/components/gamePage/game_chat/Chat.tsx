import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Button from '../../utilsComponent/button/Button.tsx';
import { getToken, getIDFromToken } from '../../../utils.ts';
import { getUserRoleForChat, getGameChatMessages } from '../../../axios.ts';
import { TypeSocketError, TypeGameChatMessage } from '../../../types.ts';
import './Chat.css'; 

type TypeChatProps = {
    gameId?: string;
}  

const gameChatSocket = io("http://localhost:3002/game_chat", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
});  

const Chat: React.FC<TypeChatProps> = ({ gameId }) => {

    const [messages, setMessages] = useState<TypeGameChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [sender, setSender] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const token = getToken();
    const userId = getIDFromToken(token);

    useEffect(() => {
        getUserRoleForChat(gameId as string, userId as number, token, setSender)
        getGameChatMessages(gameId as string, token, setMessages)
        gameChatSocket.emit("start_chat", userId)
        gameChatSocket.on("error-event", (error:TypeSocketError) => {
            console.error(`Error ${error.message} ${error.code}`);
            alert(error.message);
        })
    }, [])    
    

    useEffect(() => {
        gameChatSocket.on("receive_message", (message: TypeGameChatMessage) => {
            console.log("receive_message.start")
            console.dir({messages, message})

            setMessages([...messages, message]);
            console.dir({messages, message})
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
        gameChatSocket.emit("send_message", userId, gameId, inputMessage)
        setInputMessage('');
        scrollToBottom();
    };

    
    return (
        <div className="chat-container">
        <div className="messages-container">
            {messages.map((message, index) => (
            <p key={index} className="message">
                <strong>{message.sender}</strong> 
                <strong>({message.username}):</strong>
                {message.message}
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