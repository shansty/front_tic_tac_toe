import React, { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3001');
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};