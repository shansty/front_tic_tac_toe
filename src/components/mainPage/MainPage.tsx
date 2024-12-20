import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../utilsComponent/button/Button.tsx';
import { getToken, checkTokenExparation, getIDFromToken } from '../../utils.ts'
import { setupGameInfo } from '../../utils.ts';
import { io } from 'socket.io-client';
import PopUp from '../utilsComponent/popUp/PopUp.tsx';
import Players from './players/Players.tsx';
import MainChat from './mainChat/MainChat.tsx';
import Header from '../header/Header.tsx';
import './MainPage.css';


const MainPage: React.FC = () => {
    const token = getToken() as string;
    const user_id = getIDFromToken(token);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const awaitingRoomSocket = io(`${process.env.REACT_APP_SOCKET_HOST}/awaiting_room`, {
        reconnectionDelayMax: Number(process.env.REACT_APP_MAX_DELAY),
        reconnection: true,
        auth: {
            token
        }
    });

    awaitingRoomSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    useEffect(() => {
        checkTokenExparation(token)
    }, [token])

    const handleClick = async () => {
        setShowPopup(true);
        awaitingRoomSocket.emit("await", user_id);
        awaitingRoomSocket.on("gameid", (gameId) => {
            console.log(gameId);
            console.dir({ gameId });

            setShowPopup(false);
            setupGameInfo(navigate, gameId);
        });
    };


    const handleStopLooking = () => {
        awaitingRoomSocket.emit("stop_awaiting", user_id);
        awaitingRoomSocket.off("gameid");
        setShowPopup(false);
    };


    return (
        <>
            <Header />
            <div className='main_page_container'>
                <Players />
                <Button className='main_button' onClick={handleClick}>Start the game</Button>
                <MainChat />
            </div>
            {showPopup && (
                <div>
                    <PopUp
                        imgSrc="/loading.svg"
                        text="Looking for another player..."
                        buttonText='Close'
                        onClick={handleStopLooking}
                    />
                </div>
            )}
        </>
    );
}

export default MainPage;
