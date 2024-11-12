import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../utilsComponent/Button.tsx';
import './MainPage.css';
import { getToken } from '../../utils.ts'
import { setupGameInfo } from '../../axios.ts';
import { Socket, io } from 'socket.io-client';
import PopUp from '../utilsComponent/PopUp.tsx';

const MainPage = () => {

    const token = getToken();
    const navigate = useNavigate();
    const socket = io("http://localhost:3001", {
        reconnectionDelayMax: 10000,
        reconnection: true,

      }) as Socket;
    const [showPopup, setShowPopup] = useState(false);


    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      }); 
  

    const handleClick = async () => {
        if(socket) {
            setShowPopup(true);
            socket.emit("Waiting for game connection")
            socket.on("Waiting for game partner", () => {
                
            })
            socket.on('roomCreated', msg => {
                console.log(msg)
            })
            socket.on('startGame', () => {
                setShowPopup(false);
                setupGameInfo(token, navigate)
            })
        }
    }
   
    return(
        <>
            <Button className='main_button' onClick={handleClick}>Start the game</Button>
            {showPopup && (
                    <PopUp message="Looking for another player..." />
                )}
        </>
    );
}

export default MainPage;