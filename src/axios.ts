import axios from 'axios';
import { getIDFromToken, getToken } from './utils.ts';


// const SET_UP_GAME_URL = `http://localhost:3001/game/${id}`

export const setupGameInfo = async (token:string, navigate:Function) => {
    const id = getIDFromToken(token);
    const GAME_URL = `http://localhost:3001/main/${id}`
    try {
        const response = await axios.get(GAME_URL,   
            {headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json',
                'Authorization':   `Bearer ${token}`}});
        let gameId = response?.data?.game?.gameId;
        navigate(`/game/${gameId}`)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}


// export const updateBoardWithX = async (x:number, token:string, gameId:string) => {
//     const id = getIDFromToken(token);
//     const UPDATE_GAME_URL = `http://localhost:3001/game/${id}`
//     const body = {
//         gameId: gameId,
//         x: x
//     }

//     try {
//         const response = await axios.put(UPDATE_GAME_URL, body,  
//             {headers: {
//                 'Access-Control-Allow-Origin': '*', 
//                 'Content-Type': 'application/json',
//                 'Authorization':   `Bearer ${token}`}});
//         console.log(response?.data)
//     } catch (err) {
//         window.alert(`Error: ${err}`);
//     }
// }


// export const updateBoardWithO = async (o:number, token:string, gameId:string) => {
//     const id = getIDFromToken(token);
//     const UPDATE_GAME_URL = `http://localhost:3001/game/${id}`
//     const body = {
//         gameId: gameId,
//         o: o
//     }

//     try {
//         const response = await axios.put(UPDATE_GAME_URL, body,  
//             {headers: {
//                 'Access-Control-Allow-Origin': '*', 
//                 'Content-Type': 'application/json',
//                 'Authorization':   `Bearer ${token}`}});
//         console.log(response?.data)
//     } catch (err) {
//         window.alert(`Error: ${err}`);
//     }
// }

// export const setupGameInfo = async (id:number, token:string, gameId:String) => {
//     let body = {
//         gameId: gameId,
//         player_x: id,
//         player_o: "O",
//         x: Array(3).fill(null),
//         o: Array(3).fill(null)  
//     }
//     try {
//         const response = await axios.post(GAME_URL, body,    
//             {headers: {
//                 'Access-Control-Allow-Origin': '*', 
//                 'Content-Type': 'application/json',
//                 'Authorization':   `Bearer ${token}`}});
//         console.log(response?.data?.game)
//     } catch (err) {
//         window.alert(`Error: ${err}`);
//     }
// }