import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Board from '../board/Board.tsx';
import Button from '../../utilsComponent/button/Button.tsx';
import PopUp from '../../utilsComponent/popUp/PopUp.tsx';
import Chat from '../game_chat/Chat.tsx';
import Notification from '../../utilsComponent/notification/Notification.tsx';
import { getToken, getIDFromToken, calculateWinner, setupGameInfo } from '../../../utils.ts';
import { getGameResult, makeGameFightStatusComplited } from '../../../axios.ts';
import { TypeGame, TypeSocketError, EnumRole } from '../../../types.ts'
import './Game.css'

export const gamesSocket = io("http://localhost:3002/games", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
});

export const awaitingRoomSocket = io("http://localhost:3002/awaiting_room", {
    reconnectionDelayMax: 10000,
    reconnection: true,
});



const Game: React.FC = () => {
    const { id: gameId } = useParams();
    const token = getToken();
    const user_id = getIDFromToken(token) as number;
    const navigate = useNavigate();

    const [board, setBoard] = useState<string[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [draw, setDraw] = useState(false);
    const [winnerIndexes, setWinnerIndexes] = useState(Array(3).fill(null));
    const [winner, setWinner] = useState<String>()
    const [playerRole, setPlayerRole] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [notification, setNotification] = useState(false);
    const [rivalUser, setRivalUser] = useState(Number);


    useEffect(() => {
        const winner = calculateWinner(board, setWinnerIndexes)
        setWinner(winner)
        if(winner) {
            makeGameFightStatusComplited(winner, user_id, gameId as string, token)
            console.log(`CHEEEEEEEEEEEEEECK 1`)
        }
    }, [board])


    useEffect(() => {
        getGameResult(gameId as string, token, board, setBoard)
        gamesSocket.on("error-event", (error: TypeSocketError) => {
            console.error(`Error ${error.message} ${error.code}`);
            alert(error.message);
        })
        joinRoom();
    }, [])


    useEffect(() => {
        console.dir({ user_id, gameId })

        awaitingRoomSocket.on('gameid', (gameId) => {
            setShowPopup(false);
            setupGameInfo(navigate, gameId)
            navigate(0);
        })

        gamesSocket.emit("start_game", user_id, gameId)


        gamesSocket.on("determining_the_order_of_moves", (msg: string) => {
            setPlayerRole(msg);
        })

        gamesSocket.on(`update-${gameId}`, (game: TypeGame) => {
            const board = Array(9).fill(null)
            console.dir({ game })
            const gameUserX = game.game_user.find(gu => gu.role === EnumRole.PLAYER_X)
            if (gameUserX) {
                const gameUserXId = gameUserX.id
                game.game_move.forEach(move => {
                    console.dir({ move, gameUserXId })
                    board[move.move_index] = move.game_user_id === gameUserXId ? "X" : "O"
                    console.dir(board)
                })
            }
            setBoard(board)
            if (!board.includes(null) && (winner !== "X" || winner !== "O")) {
                setDraw(true)
                makeGameFightStatusComplited("", user_id, gameId as string, token)
            }
            console.log(` Board ${board}`)
        });

        gamesSocket.on("order_of_move", (turn: string) => {
            if (turn === "X") {
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


    useEffect( () => {
        awaitingRoomSocket.on("rematch", (rival_user_id: number) => {
            console.log("AWAITING REMATCH IS WORK")
            setRivalUser(rival_user_id)
            setNotification(true)
        })
        awaitingRoomSocket.on("decline", (message: string) => {
            setShowPopup(false)
            console.log(message)
        })
    }, [notification])


    const handleClick = (index: number) => {
        gamesSocket.emit("move", gameId, user_id, index)
    }


    const startNewGame = async () => {
        setShowPopup(true)
        clearBoard();
        awaitingRoomSocket.emit("await", user_id)
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

    const handleClosePopup = () => {
        setShowPopup(false);
        setWinner(undefined)
        setDraw(false)
    };


    const handleRematch = () => {
        awaitingRoomSocket.emit("awaiting_for_rematch", user_id, gameId)
        setShowPopup(true);
    }


    const handleRematchAgree = () => {
        clearBoard()
        awaitingRoomSocket.emit("start_rematch", rivalUser, user_id)
        setNotification(false)
        console.log("HANDLE REMATCH AGREEE")
    }


    const handleRematchDecline = () => {
        console.log("HANDLE REMATCH DECLINE")
        awaitingRoomSocket.emit("decline_rematch", rivalUser, user_id)
        setNotification(false)
        setShowPopup(false)
    }


    const joinRoom = () => {
        awaitingRoomSocket.emit("join_room", user_id)
        console.log(`Join room function`)
    }


    const clearBoard = () => {
        setWinnerIndexes(Array(3).fill(null))
        setWinner(undefined)
        setDraw(false)
        setBoard(Array(9).fill(null))
    }


    return (
        <>
            {notification && (
                <Notification
                    imgSrc="/balloon.svg"
                    notificationText="User wanna rematch"
                    firstButtonText='Agree'
                    firstOnClick={handleRematchAgree}
                    secondButtonText="Decline"
                    secondOnClick={handleRematchDecline}
                />
            )}
            <div className="game">
                <p className='game_text'>
                    {playerRole}
                </p>
                <p className='game_text'>
                    {winner ? 'The winner is ' + winner : !winner && !draw ? 'Now it is ' + (isXNext ? 'X' : 'O') + ' turn' : "This is the draw!"}
                </p>
                <Board squares={board} handleClick={handleClick} winningIndexes={winnerIndexes} />
                <Button className='game_button' onClick={startNewGame}>Start a new game</Button>
                <Button className='game_button' onClick={handleGoToMain}> Go to main page </Button>
                <Button className='game_button' onClick={handleRematch}> Rematch </Button>
            </div>
            <Chat gameId={gameId} />
            {showPopup && (
                <PopUp
                    imgSrc="/loading.svg"
                    text="Awaiting for another player..."
                    buttonText='Close'
                    onClick={handleStopLooking}
                />
            )}
            {winner && (
                <PopUp
                    imgSrc="/balloon.svg"
                    text={`Congratulations! The winner is ${winner}`!}
                    buttonText='Rematch'
                    onClick={handleRematch}
                    secondButton={{
                        text: "Start a new game",
                        onClick: startNewGame,
                    }}
                    optionalButton={{
                        text: "Go to the main page",
                        onClick: handleGoToMain,
                    }}
                    closeButtononClose={{
                        onClick: handleClosePopup
                    }}
                />
            )}
            {draw && (
                <PopUp
                    imgSrc="/balloon.svg"
                    text="This is the draw!"
                    buttonText='Rematch'
                    onClick={handleRematch}
                    secondButton={{
                        text: "Start a new game",
                        onClick: startNewGame,
                    }}
                    optionalButton={{
                        text: "Go to the main page",
                        onClick: handleGoToMain,
                    }}
                    closeButtononClose={{
                        onClick: handleClosePopup
                    }}
                />
            )}
        </>
    );
}

export default Game;