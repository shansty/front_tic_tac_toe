import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
    id: number;
    exp: number;
    iat: number;
  }


export function getIDFromToken(token:string):number | null {
    if(!token) {
        return null
    } else {
        const decoded: CustomJwtPayload = jwtDecode(token);
        return decoded.id;
    }
}


export function getToken(): string  {
    const token = localStorage.getItem("token") as string
    if(!token || token === null) {
        window.location.assign("http://localhost:3000/")
    } else {
        const decoded = jwtDecode(token);
        let exparation = decoded.exp as number;
        if(Date.now() > (exparation * 1000)){
            window.location.assign("http://localhost:3000/")
        } 
    }
    return token;
}


type SquaresArray = string[];


export function calculateWinner(squares: SquaresArray, setWinnerIndexes: (value: React.SetStateAction<any[]>) => void) {
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
            // setWinnerIndexes(lines[i])
            console.log('inside calculateWinner');
            const log = lines[i]
            console.dir({log});
            return {
                winner: squares[a],
                winnerIndexes:lines[i]
            }
        }
    }
}


export const setupGameInfo = async (navigate:Function, gameId:string) => {
    try {
        navigate(`/game/${gameId}`)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}