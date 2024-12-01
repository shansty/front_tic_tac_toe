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

export type TypeChatMessage = {
    message: string;
    sender: string;
  }



