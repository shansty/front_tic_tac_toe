import axios from "axios";
import { EnumRole, TypeGame, TypeGameChatMessage, TypeNotification, TypeUserGameData } from "./types.ts";


export const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    username:string, 
    password:string, 
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
) => {
    const LOGIN_URL = 'http://localhost:3001/login'
    try {
        e.preventDefault();
        const response = await axios.post(LOGIN_URL, { username, password },
            { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });

        const token = response?.data?.token;
        localStorage.setItem("token", token);

        setUsername('');
        setPassword('');

    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const signUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    setIsRegister:React.Dispatch<React.SetStateAction<boolean>>, 
    isRegister: boolean, 
    email: string, 
    password: string, 
    username: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
) => {

    const REGISTER_URL = 'http://localhost:3001/register';
    e.preventDefault();
    setIsRegister(!isRegister)
    try {
        await axios.post(REGISTER_URL, { email, password, username },
            { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });
        setEmail('');
        setPassword('');
        setUsername('');

    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getGameResult = async (gameId: string, token: string, board: string[], setBoard: React.Dispatch<React.SetStateAction<string[]>>) => {
    const GET_GAME_RESULTS_URL = `http://localhost:3001/game/${gameId}`
    try {
        const response = await axios.get(GET_GAME_RESULTS_URL,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        const game: TypeGame = response.data.game;
        console.dir({ game: game })
        if (game.game_user) {
            const gameUserX = game.game_user.filter(gu => gu.game_id === gameId).find(gu => gu.role === EnumRole.PLAYER_X)
            if (gameUserX) {
                const gameUserXId = gameUserX.id
                game.game_move.forEach(move => {
                    board[move.move_index] = move.game_user_id === gameUserXId ? "X" : "O"
                    console.dir(board)
                })
            }
        }
        setBoard([...board])
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getUserRoleForChat = async (gameId: string, id: number, token: string, setUserRole: React.Dispatch<React.SetStateAction<string>>) => {
    const GET_USER_ROLE_FOR_CHAT_URL = `http://localhost:3001/chat/${id}`
    try {
        const response = await axios.post(GET_USER_ROLE_FOR_CHAT_URL, { gameId },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        const userRole = response.data.user_role;
        setUserRole(userRole)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getGameChatMessages = async (gameId: string, token: string, setMessages: React.Dispatch<React.SetStateAction<TypeGameChatMessage[]>>) => {
    console.log(`Axios get game chat messages start`)
    const GET_GAME_CHAT_MESSAGES_URL = `http://localhost:3001/chat/${gameId}`
    try {
        const response = await axios.get(GET_GAME_CHAT_MESSAGES_URL,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        const game_history: TypeGameChatMessage[] = response?.data?.game_history;
        console.dir({ game_history })
        setMessages(game_history)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getNotifications = async (userId: number, token: string, setNotifications:  React.Dispatch<React.SetStateAction<TypeNotification[]>>) => {
    const GET_NOTIFICATIONS_URL = `http://localhost:3001/notifications/${userId}`
    try {
        const response = await axios.get(GET_NOTIFICATIONS_URL,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        const notifications:TypeNotification[] = response?.data?.notifications;
        setNotifications(notifications)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const declineNotifications = async (userId: number, rival_username:string, token: string) => {
    const DECLINE_NOTIFICATIONS_URL = `http://localhost:3001/notifications/${userId}`
    try {
        const response = await axios.put(DECLINE_NOTIFICATIONS_URL, {rival_username},
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const acceptNotifications = async (userId: number, rival_username:string, token: string) => {
    const ACCEPT_NOTIFICATIONS_URL = `http://localhost:3001/notifications/accept/${userId}`
    try {
        const response = await axios.put(ACCEPT_NOTIFICATIONS_URL, {rival_username},
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getUserGamesData = async (userId: number, token: string, setGamesData: React.Dispatch<React.SetStateAction<TypeUserGameData[]>>) => {
    const GET_USER_GAMES_DATA_URL = `http://localhost:3001/gameData/${userId}`
    try {
        const response = await axios.get(GET_USER_GAMES_DATA_URL, 
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        const games = response.data.games 
        setGamesData(games)   
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const makeGameFightStatusComplitedAndUpdateGoogkeSheet = async (winner:string, winnerIndexes: number[], userId:number,  gameId:string, token:string) => {
    const CHANGE_GAME_FIGHT_STATUS_URL = `http://localhost:3001/gameData/${userId}`
    console.log(winnerIndexes)
    console.dir({winnerIndexes})
    try {
        await axios.put(CHANGE_GAME_FIGHT_STATUS_URL, {gameId, winner, winnerIndexes},
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}