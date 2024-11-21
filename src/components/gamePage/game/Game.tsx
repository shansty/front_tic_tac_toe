import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import Board from '../board/Board.tsx';
import Button from '../../utilsComponent/Button.tsx';
import PopUp from '../../utilsComponent/PopUp.tsx';
import Chat from '../game_chat/Chat.tsx';
import { getToken, getIDFromToken, calculateWinner, setupGameInfo } from '../../../utils.ts';
import { getGameResult } from '../../../axios.ts';
import { Games } from '../../../types.ts'
import './Game.css'


type SquaresArray = string[];

const gamesSocket = io("http://localhost:3002/games", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
}) as Socket;

const awaitingRoomSocket = io("http://localhost:3002/awaiting_room", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    transports : ['websocket'],
}) as Socket;


const Game = () => {
    const { id: gameId } = useParams();
    console.log(`DEGUG GAME_ID ${gameId}`)
    const token = getToken();
    const user_id = getIDFromToken(token);
    const navigate = useNavigate();

    const [board, setBoard] = useState<SquaresArray>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [draw, setDraw] = useState(false);
    const [winnerIndexes, setWinnerIndexes] = useState(Array(3).fill(null));
    const [winner, setWinner] = useState<String>()
    const [playerRole, setPlayerRole] = useState("");
    const [showPopup, setShowPopup] = useState(false);


    gamesSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    }); 


    useEffect(() => {
        const winner = calculateWinner(board, setWinnerIndexes)
        setWinner(winner)
    }, [board])


    useEffect(() => {
        getGameResult(gameId as string, token, board, setBoard)
    }, [])


    useEffect(() => {
        console.log("Inside useEffect")
        gamesSocket.emit("start_game", user_id, gameId)
        gamesSocket.on("determining_the_order_of_moves", (msg:string) => {
            setPlayerRole(msg);
        })
        gamesSocket.on(`update-${gameId}`, (game: Games) => {
            const board = Array(9).fill(null)
            game.o.forEach(i => { board[i] = "O"})
            game.x.forEach(i => { board[i] = "X"})
            if(!board.includes(null)) {
                setDraw(true)
            }
            setBoard(board)
        });
        gamesSocket.on("order_of_move", (turn:string) => {
            if(turn == "X") {
                setIsXNext(true) 
            } else {
                setIsXNext(false)
            }
        });

        return () => {
            console.log("useEffect retrun")
            gamesSocket.off(`update-${gameId}`);
        };
    }, [gameId]);


    const handleClick = (index:number) => {
        gamesSocket.emit("move", gameId, user_id, index)        
    }


    const startNewGame = async () => {
        setShowPopup(true)
        setWinnerIndexes(Array(3).fill(null))
        setWinner(undefined)
        setDraw(false)
        awaitingRoomSocket.emit("await", user_id)
        awaitingRoomSocket.on('gameid', ({ gameId }) => {
            console.log(gameId)
            console.dir({ gameId })
            setupGameInfo(navigate, gameId)
            setShowPopup(false)
        })
        setBoard(Array(9).fill(null))
    };
    

    const handleStopLooking = () => {
        if (awaitingRoomSocket) {
            awaitingRoomSocket.emit("stop_awaiting", user_id); 
            awaitingRoomSocket.off("gameid"); 
            setShowPopup(false); 
        }
    };


    const handleGoToMain = () => {
        setShowPopup(false); 
        navigate("/main");
    }


    return (
        <>
            <div className="game">
                <p className='game_text'>
                    {playerRole}
                </p>
                <p className='game_text'>
                    { winner ? 'The winner is ' + winner : !winner && !draw ? 'Now it is ' + (isXNext ? 'X' : 'O') + ' turn' : "This is the draw!"}
                </p>
                <Board squares={board} handleClick={handleClick} winningIndexes={winnerIndexes}/>
                <Button className='game_button' onClick={startNewGame}>Start a new game</Button>
            </div>
            <Chat gameId={gameId}/>
            {showPopup && (
                        <PopUp 
                            imgSrc= "/loading.svg"
                            text="Looking for another player..." 
                            buttonText='Close'
                            onClick={handleStopLooking}
                        />
                    )}
            {winner && (
                        <PopUp 
                            imgSrc= "/balloon.svg"
                            text={`Congratulations! The winner is ${winner}`!}
                            buttonText='Start a new game'
                            onClick={startNewGame}
                            secondButton={{
                                text: "Go to the main page", 
                                onClick: handleGoToMain,
                            }}
                    />
            )}   
            {draw && (
                        <PopUp 
                            imgSrc= "/balloon.svg"
                            text="This is the draw!"
                            buttonText='Start a new game'
                            onClick={startNewGame}
                            secondButton={{
                                text: "Go to the main page", 
                                onClick: handleGoToMain,
                            }}
                    />
            )}    
        </>
    );
}

export default Game;