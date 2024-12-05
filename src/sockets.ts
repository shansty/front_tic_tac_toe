import { Socket, io } from 'socket.io-client';

export const gamesSocket = io("http://localhost:3002/games", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    withCredentials: true,
});

export const awaitingRoomSocket = io("http://localhost:3002/awaiting_room", {
    reconnectionDelayMax: 10000,
    reconnection: true,
    // transports: ['websocket'],
});


