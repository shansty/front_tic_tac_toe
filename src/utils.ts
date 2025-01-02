import { jwtDecode } from "jwt-decode";


interface ICustomJwtPayload {
    id: number;
    exp: number;
    iat: number;
}


export function getIDFromToken(token: string | undefined): number | null {
    if (!token) {
        return null
    } else {
        const decoded: ICustomJwtPayload = jwtDecode(token);
        return decoded.id;
    }
}

export function getToken(): string | null {
    const token = localStorage.getItem("token") as string
    if (!token || token === null || token === "") {
        return null;
    }
    return token;
}

export function checkTokenExparation(token: string | null): void {
    if (!token || token === null || "") {
        window.location.assign("http://localhost:3000/")
    } else {
        const decoded = jwtDecode(token);
        let exparation = decoded.exp as number;
        if (Date.now() > (exparation * 1000)) {
            localStorage.removeItem("token")
            window.location.assign("http://localhost:3000/")
        }
    }
}

export function calculateWinner(squares: string[]) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winnerIndexes: lines[i]
            }
        }
    }
    return;
}

export const setupGameInfo = async (navigate: Function, gameId: string) => {
    try {
        navigate(`/game/${gameId}`)
    } catch (err) {
        window.alert(`Error: ${err}`);
    }
}

export const getHeaders = (token: string) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}