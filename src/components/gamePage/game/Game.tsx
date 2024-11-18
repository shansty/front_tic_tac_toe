import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Board from '../board/Board.tsx';
import Button from '../../utilsComponent/Button.tsx';
import axios from 'axios';
import { getToken, getIDFromToken } from '../../../utils.ts';
import './Game.css'
import { Socket, io } from 'socket.io-client';
import { Games } from '../../../types.ts'
import { setupGameInfo } from '../../../axios.ts';
import PopUp from '../../utilsComponent/PopUp.tsx';


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
    const {id:gameId} = useParams();
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
        const winner = calculateWinner(board)
        setWinner(winner)
    }, [board])

    useEffect(() => {
        getGameResult()
    }, [])


    useEffect(() => {
        console.log("Inside useEffect")
      gamesSocket.emit("start_game", user_id, gameId)
      console.log(`start_game socket ${gameId} ${user_id}`)
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


    const getGameResult = async() => {
        const GET_GAME_RESULTS_URL = `http://localhost:3001/game/${gameId}`
        try {
            const response = await axios.get(GET_GAME_RESULTS_URL, 
                {headers: {
                    'Access-Control-Allow-Origin': '*', 
                    'Content-Type': 'application/json',
                    'Authorization':   `Bearer ${token}`}});
            console.log(response.data.game)
            let indexOFX = response.data.game.x;
            let indexOFO = response.data.game.o;
            for(let index of indexOFX) {
                board[index] = 'X'
            }
            for(let index of indexOFO) {
                board[index] = 'O'
            }
            setBoard([...board])
        } catch (err) {
            window.alert(`Error: ${err}`);
        }
    }

    const handleClick = (index:number) => {
        gamesSocket.emit("move", gameId, user_id, index)        
    }

    
    function calculateWinner(squares: SquaresArray) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        
        for(let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                setWinnerIndexes(lines[i])
                return squares[a]
            }
        }
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
                {/* Chat */}
            </div>
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