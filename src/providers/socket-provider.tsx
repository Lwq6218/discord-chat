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
  const heartBeatInterval = 30000; // 心跳间隔时间（毫秒）
  const reconnectIntervalBase = 5000; // 初始重连间隔时间（毫秒）
  const maxReconnectAttempts = 10; // 最大重连尝试次数

  useEffect(() => {
    let heartBeatTimer: NodeJS.Timeout;
    let reconnectTimer: NodeJS.Timeout;
    let reconnectAttempts = 0;

    const connect = () => {
      const socketInstance = new WebSocket(
        import.meta.env.VITE_DISCORD_CHAT_WS_URL + '/ws'
      );

      const sendHeartBeat = () => {
        if (socketInstance.readyState === WebSocket.OPEN) {
          socketInstance.send(JSON.stringify({ type: 'HEARTBEAT' }));
        }
      };

      socketInstance.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        heartBeatTimer = setInterval(sendHeartBeat, heartBeatInterval);
        reconnectAttempts = 0; // 重置重连尝试次数
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
      };

      socketInstance.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        clearInterval(heartBeatTimer);
        if (reconnectAttempts < maxReconnectAttempts) {
          const reconnectInterval = Math.min(
            reconnectIntervalBase * 2 ** reconnectAttempts,
            60000
          ); // 指数退避重连策略
          reconnectAttempts++;
          reconnectTimer = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.warn('Max reconnect attempts reached');
        }
      };

      socketInstance.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socketInstance.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'PING') {
          console.log('Received ping from server, sending pong');
          socketInstance.send(JSON.stringify({ type: 'PONG' }));
        } else if (message.type === 'PONG') {
          console.log('Received pong from server');
        }
      };

      setSocket(socketInstance);
    };

    connect(); // Initial connection attempt

    return () => {
      clearInterval(heartBeatTimer);
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.close();
      }
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
