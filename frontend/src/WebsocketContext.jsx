import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messageHandlers, setMessageHandlers] = useState([]);

  // Инициализация WebSocket
  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:8000/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Global WebSocket подключён");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messageHandlers.forEach(handler => handler(data));
    };

    ws.onclose = () => {
      console.log("Global WebSocket отключён");
      setTimeout(() => setSocket(null), 5000); // Переподключение через 5 сек
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Регистрация обработчиков сообщений
  const registerHandler = (handler) => {
    setMessageHandlers(prev => [...prev, handler]);
    return () => {
      setMessageHandlers(prev => prev.filter(h => h !== handler));
    };
  };

  // Отправка сообщения
  const send = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };

  const value = {
    socket,
    registerHandler,
    send
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};