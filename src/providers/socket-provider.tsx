import React, { createContext, useContext, useEffect, useState } from 'react';

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new WebSocket(
      import.meta.env.VITE_DISCORD_CHAT_WS_URL + '/ws'
    );

    socketInstance.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    socketInstance.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    socketInstance.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
