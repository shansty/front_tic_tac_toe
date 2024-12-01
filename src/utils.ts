export function getIDFromToken(token:string):number | null {
    if(!token) {
        return null
    } else {
        let tokenParts = token.split('.');
        let payload = JSON.parse(atob(tokenParts[1]));
        console.log(payload.id)
        return payload.id;
    }
}


export function getToken(): string  {
    const token: string = localStorage.getItem("token") as string
    if(!token) {
        window.location.assign("http://localhost:3000/")
    } else {
        let tokenParts = token.split('.');
        let payload = JSON.parse(atob(tokenParts[1]));
        let exparation = payload.exp;
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
            setWinnerIndexes(lines[i])
            return squares[a]
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