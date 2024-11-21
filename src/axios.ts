import axios from "axios";

type SquaresArray = string[];

export const getGameResult = async(gameId:string, token:string, board: SquaresArray, setBoard: React.Dispatch<React.SetStateAction<SquaresArray>>) => {
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


export const getUserRoleForChat = async(gameId:string, id:string, token:string, setUserRole:React.Dispatch<React.SetStateAction<string>>) => {
    const GET_USER_ROLE_FOR_CHAT_URL = `http://localhost:3001/chat/${id}`
    try {
        const response = await axios.post(GET_USER_ROLE_FOR_CHAT_URL, {gameId},
            {headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json',
                'Authorization':   `Bearer ${token}`}});
        const userRole = response.data.userRole;
        console.log(`AXIOS USER_ROLE ${userRole}`)
        console.log(`1 Axios getUserRoleForChat in useEffect`)
        setUserRole(userRole)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}