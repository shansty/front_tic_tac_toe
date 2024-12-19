import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { getHeaders } from "./utils.ts";
import { EnumRole, TypeGame, TypeGameChatMessage, TypeNotification, TypeUserGameData } from "./types.ts";
import { LOGIN_URL, REGISTER_URL, GAME_URL, GAME_CHAT_URL, NOTIFICATIONS_URL, ACCEPT_NOTIFICATIONS_URL, GAMES_DATA_URL } from "./configs/axios_urls.ts";


export const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    username: string,
    password: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    navigate: NavigateFunction,
) => {
    try {
        e.preventDefault();
        const response = await axios.post(LOGIN_URL, { username, password },
            { headers: { 'Content-Type': 'application/json' } });

        const token = response?.data?.token;
        localStorage.setItem("token", token);

        setUsername('');
        setPassword('');
        navigate('/main')
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const signUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    setIsRegister: React.Dispatch<React.SetStateAction<boolean>>,
    isRegister: boolean,
    email: string,
    password: string,
    username: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
) => {

    e.preventDefault();
    setIsRegister(!isRegister)
    try {
        await axios.post(REGISTER_URL, { email, password, username },
            { headers: { 'Content-Type': 'application/json' } });
        setEmail('');
        setPassword('');
        setUsername('');
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getGameResult = async (gameId: string, token: string, board: string[], setBoard: React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
        const response = await axios.get(`${GAME_URL}/${gameId}`,
            {
                headers: getHeaders(token)
            });
        const game: TypeGame = response.data.game;
        if (game.game_user) {
            const gameUserX = game.game_user.filter(gu => gu.game_id === gameId).find(gu => gu.role === EnumRole.PLAYER_X)
            if (gameUserX) {
                const gameUserXId = gameUserX.id
                game.game_move.forEach(move => {
                    board[move.move_index] = move.game_user_id === gameUserXId ? "X" : "O"
                })
            }
        }
        setBoard([...board])
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getUserRoleForChat = async (gameId: string, id: number, token: string, setUserRole: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await axios.post(`${GAME_CHAT_URL}/${id}`, { gameId },
            {
                headers: getHeaders(token)
            });
        const userRole = response.data.user_role;
        setUserRole(userRole)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getGameChatMessages = async (gameId: string, token: string, setMessages: React.Dispatch<React.SetStateAction<TypeGameChatMessage[]>>) => {
    console.log("getGameChatMessages.start")
    try {
        const response = await axios.get(`${GAME_CHAT_URL}/${gameId}`,
            {
                headers: getHeaders(token)
            });
        const game_history: TypeGameChatMessage[] = response?.data?.game_history;
        setMessages(game_history)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getNotifications = async (userId: number, token: string, setNotifications: React.Dispatch<React.SetStateAction<TypeNotification[]>>) => {
    try {
        const response = await axios.get(`${NOTIFICATIONS_URL}/${userId}`,
            {
                headers: getHeaders(token)
            });
        const notifications: TypeNotification[] = response?.data?.notifications;
        setNotifications(notifications)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const declineNotifications = async (userId: number, rival_username: string, token: string) => {
    try {
        const response = await axios.put(`${NOTIFICATIONS_URL}/${userId}`, { rival_username },
            {
                headers: getHeaders(token)
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const acceptNotifications = async (userId: number, rival_username: string, token: string) => {
    try {
        const response = await axios.put(`${ACCEPT_NOTIFICATIONS_URL}/${userId}`, { rival_username },
            {
                headers: getHeaders(token)
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const getUserGamesData = async (userId: number, token: string, setGamesData: React.Dispatch<React.SetStateAction<TypeUserGameData[]>>) => {
    try {
        const response = await axios.get(`${GAMES_DATA_URL}/${userId}`,
            {
                headers: getHeaders(token)
            });
        const games = response.data.games
        setGamesData(games)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


export const makeGameFightStatusComplitedAndUpdateGoogleSheet = async (winner: string, winnerIndexes: number[], userId: number, gameId: string, token: string) => {
    try {
        await axios.put(`${GAMES_DATA_URL}/${userId}`, { gameId, winner, winnerIndexes },
            {
                headers: getHeaders(token)
            });
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}