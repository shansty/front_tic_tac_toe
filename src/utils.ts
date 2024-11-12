export function getIDFromToken(token:string) {

    if(!token) {
        return null
    } else {
        let tokenParts = token.split('.');
        let payload = JSON.parse(atob(tokenParts[1]));
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