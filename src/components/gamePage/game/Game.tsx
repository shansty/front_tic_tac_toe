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

type SquaresArray = string[];

const gamesSocket = io("http://localhost:3002/games", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
}) as Socket;

const Game = () => {
    const {id:gameId} = useParams()
    const token = getToken();
    const user_id = getIDFromToken(token);
    const navigate = useNavigate();

    const [board, setBoard] = useState<SquaresArray>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true)
    const [draw, setDraw] = useState(false)
    const [winnerIndexes, setWinnerIndexes] = useState(Array(3).fill(null))
    const [winner, setWinner] = useState<String>()
    const [playerRole, setPlayerRole] = useState("")


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
      gamesSocket.emit("start_game", user_id, gameId)
      gamesSocket.on("determining_the_order_of_moves", (msg:string) => {
        setPlayerRole(msg);
        console.log(playerRole)
      })
      gamesSocket.on(`update-${gameId}`, (game: Games) => {
        console.dir({ game })
        const board = Array(9).fill(null)

        game.o.forEach(i => { board[i] = "O"})
        game.x.forEach(i => { board[i] = "X"})

        console.dir({ board })
        if(!board.includes(null)) {
            setDraw(true)
        }
        setBoard(board)
      });
      gamesSocket.on("order_of_move", (turn:string) => {
        if(turn == "X") {
            setIsXNext(true) 
        };
        if( turn == "O") {
            setIsXNext(false)
        }
      });
      return () => {
        console.log("useEffect retrun")
        gamesSocket.off(`update-${gameId}`);
      };
    }, []);


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
        setBoard(Array(9).fill(null));
        setIsXNext(true)
        setWinnerIndexes(Array(3).fill(null))
        setWinner(undefined)
        setDraw(false)
        //setupGameInfo(token, navigate)
        if(token) {
            //setupGameInfo(token, navigate)
        }
    };


    return (
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
    );
}

export default Game;
