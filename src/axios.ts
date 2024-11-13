import axios from 'axios';
import { getIDFromToken } from './utils.ts';


// const SET_UP_GAME_URL = `http://localhost:3001/game/${id}`

export const setupGameInfo = async (token:string, navigate:Function, gameId:string, user_X:string, user_O:string) => {
    const id = getIDFromToken(token);
    const GAME_URL = `http://localhost:3001/main/${id}`
    const body = {
        gameId: gameId,
        user_X: user_X,
        user_O: user_O
    }
    console.dir(body)
    try {
        await axios.post(GAME_URL, body,   
            {headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json',
                'Authorization':   `Bearer ${token}`}});
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