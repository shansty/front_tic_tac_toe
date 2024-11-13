import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../utilsComponent/Button.tsx';
import './MainPage.css';
import { getToken, getIDFromToken } from '../../utils.ts'
import { setupGameInfo } from '../../axios.ts';
import { Socket, io } from 'socket.io-client';
import PopUp from '../utilsComponent/PopUp.tsx';

const MainPage = () => {

    const token = getToken();
    const user_id = getIDFromToken(token);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const awaitingRoomSocket = io("http://localhost:3001/awaiting_room", {
        reconnectionDelayMax: 10000,
        reconnection: true,
    }) as Socket;


    awaitingRoomSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    }); 
  

    const handleClick = async () => {
        if(awaitingRoomSocket) {
            setShowPopup(true);
            awaitingRoomSocket.emit("await", user_id)

            awaitingRoomSocket.on('gameid', ({ gameId, user_X, user_O}) => {
                console.log(gameId)
                setShowPopup(false);
                setupGameInfo(token, navigate, gameId, user_X, user_O)
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