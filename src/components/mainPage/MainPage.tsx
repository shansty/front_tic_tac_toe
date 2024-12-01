import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../utilsComponent/Button.tsx';
import './MainPage.css';
import { getToken, getIDFromToken } from '../../utils.ts'
import { setupGameInfo } from '../../utils.ts';
import { Socket, io } from 'socket.io-client';
import PopUp from '../utilsComponent/PopUp.tsx';


const awaitingRoomSocket = io("http://localhost:3002/awaiting_room", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    transports : ['websocket'],
}) as Socket;


const MainPage: React.FC = () => {

    const token = getToken();
    const user_id = getIDFromToken(token);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);


    awaitingRoomSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    }); 
  

    const handleClick = async () => {
        if (awaitingRoomSocket) {
            setShowPopup(true);
            awaitingRoomSocket.emit("await", user_id);
            awaitingRoomSocket.on("gameid", (gameId) => {
                console.log(gameId);
                console.dir({ gameId });
    
                setShowPopup(false);
                setupGameInfo(navigate, gameId);
            });
        }
    };


    const handleStopLooking = () => {
        if (awaitingRoomSocket) {
            awaitingRoomSocket.emit("stop_awaiting", user_id); 
            awaitingRoomSocket.off("gameid"); 
            setShowPopup(false); 
        }
    };
   

    return(
        <>
            <Button className='main_button' onClick={handleClick}>Start the game</Button>
            {showPopup && (
                    <PopUp 
                        imgSrc= "/loading.svg"
                        text="Looking for another player..." 
                        buttonText='Close'
                        onClick={handleStopLooking}
                    />
                )}
        </>
    );
}

export default MainPage;
