export type TypeSocketError = {
    message: string;
    code: number;
}

export type TypeUser = {
    id: number;
    email: string;
    password: string;
    game_user: TypeGameUser[];
    game_message: TypeGameMessage[];

}

export type TypeGame = {
    id: string;
    game_user: TypeGameUser[];
    game_move: TypeGameMove[];
    game_message: TypeGameMessage[];
}

export type TypeGameUser = {
    id: number;
    user_id: number;
    user: TypeUser;
    game_id?: string;
    game?: TypeGame
    role?: EnumRole;
    game_move: TypeGameMove[];
}

export enum EnumRole {
    PLAYER_X = "PLAYER_X",
    PLAYER_O = "PLAYER_O"
}

export type TypeGameMove = {
    id: number;
    game_user_id: number;
    game_user: TypeGameUser
    move_index: number;
    game_id: string
    game: TypeGame;
}

export type TypeGameMessage = {
    id: number;
    game_id: string;
    game: TypeGame;
    user_id: number;
    user: TypeUser
    message: string;
}

export type TypeGameChatMessage = {
    message: string;
    username: string;
    sender: string;
}

export type TypeMainChatMessage = {
    message: string;
    username: string;
}

export type TypeNotification = {
    text: string;
    rival_username: string;
}

export enum Status {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    IN_PROCESS = "IN_PROCESS",
    COMPLETED = "COMPLETED"
}

export enum Position {
    ACCEPTOR = "ACCEPTOR",
    INITIATOR = "INITIATOR",
}

export type TypeUserGameData = {
    game_status: Status,
    game_link: string,
    rival_username: string,
    position: Position
}


