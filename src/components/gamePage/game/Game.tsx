import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Board from '../board/Board.tsx';
import Button from '../../utilsComponent/Button.tsx';
import axios from 'axios';
import { getToken, getIDFromToken } from '../../../utils.ts';
import './Game.css'
import { setupGameInfo } from '../../../axios.ts';
import { useSocket } from '../../../SocketContext.tsx';

type SquaresArray = string[];

const Game = () => {
    const {id:gameId} = useParams()
    const token = getToken();
    const navigate = useNavigate();

    const [board, setBoard] = useState<SquaresArray>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true)
    const [draw, setDraw] = useState(false)
    const [winnerIndexes, setWinnerIndexes] = useState(Array(3).fill(null))
    const [winner, setWinner] = useState<String>()

    const socket = useSocket()

    useEffect(() => {
        if (socket) {
          socket.on('connection', () => {
            console.log('Connected to socket in Game:', socket.id);
          });
    
          return () => {
            socket.off('disconnect');
          };
        }
      }, [socket]);


    useEffect(() => {
        const winner = calculateWinner(board)
        setWinner(winner)
    }, [board])

    useEffect(() => {
        getGameResult()
    }, [])


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


    const updateBoardWithX = async (x:number, token:string, gameId:string) => {
        const id = getIDFromToken(token);
        const UPDATE_GAME_URL = `http://localhost:3001/game/${id}`
        const body = {
            gameId: gameId,
            x: x
        }
    
        try {
            const response = await axios.put(UPDATE_GAME_URL, body,  
                {headers: {
                    'Access-Control-Allow-Origin': '*', 
                    'Content-Type': 'application/json',
                    'Authorization':   `Bearer ${token}`}});
            console.log(response?.data)
        } catch (err) {
            window.alert(`Error: ${err}`);
        }
    }

    const updateBoardWithO = async (o:number, token:string, gameId:string) => {
        const id = getIDFromToken(token);
        const UPDATE_GAME_URL = `http://localhost:3001/game/${id}`
        const body = {
            gameId: gameId,
            o: o
        }
    
        try {
            const response = await axios.put(UPDATE_GAME_URL, body,  
                {headers: {
                    'Access-Control-Allow-Origin': '*', 
                    'Content-Type': 'application/json',
                    'Authorization':   `Bearer ${token}`}});
            console.log(response?.data)
        } catch (err) {
            window.alert(`Error: ${err}`);
        }
    }


    const handleClick = (index:number) => {
        if(winner || board[index]) {
            return
        }
        board[index] = isXNext ? 'X' : 'O'

        if(isXNext) {
            updateBoardWithX(index, token, gameId as string)
        } else {
            updateBoardWithO(index, token, gameId as string)
        }
        setBoard([...board])
        setIsXNext(!isXNext)

        let hasNoNulls = board.every((element) => element != null);
        console.log(hasNoNulls)

        if (hasNoNulls && !winner) {
            setDraw(true)
            return
        }
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
        setupGameInfo(token, navigate)
        if(token) {
            setupGameInfo(token, navigate)
        }
    };


    return (
        <div className="game">
            <p className='game_text'>
                { winner ? 'The winner is ' + winner : !winner && !draw ? 'Now it is ' + (isXNext ? 'X' : 'O') + ' turn' : "This is the draw!"}
            </p>
            <Board squares={board} handleClick={handleClick} winningIndexes={winnerIndexes}/>
            <Button className='game_button' onClick={startNewGame}>Start a new game</Button>
        </div>
    );
}

export default Game;
