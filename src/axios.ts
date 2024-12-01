import axios from "axios";
import { EnumRole, TypeGame, TypeChatMessage } from "./types.ts";


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

export const getGameChatMessages = async (gameId: string, token: string, setMessages: React.Dispatch<React.SetStateAction<TypeChatMessage[]>>) => {
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
        const game_history: TypeChatMessage[] = response?.data?.game_history;
        console.dir({ game_history })
        setMessages(game_history)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}