import React, { useState, useRef, useEffect } from 'react';
import { TypeMainChatMessage, TypeSocketError } from '../../../types';
import { getToken, getIDFromToken } from '../../../utils.ts';
import { io } from 'socket.io-client';
import Button from '../../utilsComponent/button/Button.tsx';
import "./MainChat.css"


const MainChat:React.FC = () => {

    const [messages, setMessages] = useState<TypeMainChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const token = getToken();
    const userId = getIDFromToken(token);
    
    const mainChatSocket = io(`${process.env.REACT_APP_SOCKET_HOST}/main_chat`, {
        reconnectionDelayMax: Number(process.env.REACT_APP_MAX_DELAY),
        reconnection: true,
        auth: {
            token
        }
    });  

    useEffect(() => {
        mainChatSocket.emit("start_chat", userId)
        mainChatSocket.on("error-event", (error:TypeSocketError) => {
            console.error(`Error ${error.message} ${error.code}`);
            alert(error.message);
        })
    }, [])  

    useEffect(() => {
        mainChatSocket.on("receive_message", (message: TypeMainChatMessage) => {
            console.log("receive_message.start")
            console.dir({messages, message})

            setMessages([...messages, message]);
            console.dir({messages, message})
        });
        scrollToBottom();
        return () => {
            mainChatSocket.off("receive_message");
        };
    }, [messages]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    

    const handleSendMessage = () => {
        mainChatSocket.emit("send_message", userId, inputMessage)
        setInputMessage('');
        scrollToBottom();
    };


    return (
        <div className="main-chat-container">
        <div className="main-messages-container">
            {messages.map((message, index) => (
            <p key={index} className="main-message">
                <strong>({message.username}):</strong>
                {message.message}
            </p>
            ))}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="main-input-container">
            <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="main-message-input"
            />
            <Button width='150px' className="main-send-button" onClick={handleSendMessage}>Send Message</Button>
        </div>
        </div>
    );
}

export default MainChat;
