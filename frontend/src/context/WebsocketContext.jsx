import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [userStatuses, setUserStatuses] = useState({});
    const handlersRef = useRef(new Set());

    useEffect(() => {
        const wsUrl = `ws://${window.location.hostname}:8000/ws`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket подключён");
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'status_update') {
                setUserStatuses(prev => ({
                    ...prev,
                    [data.username]: {
                        status: data.status,
                        last_seen: data.last_seen
                    }
                }));
            } else if (data.type === 'status_response') {
                setUserStatuses(prev => ({
                    ...prev,
                    [data.username]: {
                        status: data.status,
                        last_seen: data.last_seen
                    }
                }));
            } else if (data.type === 'multiple_status_response') {
                setUserStatuses(prev => ({
                    ...prev,
                    ...data.statuses
                }));
            }

            handlersRef.current.forEach(handler => handler(data));
        };

        ws.onclose = () => {
            console.log("WebSocket отключён");
            setTimeout(() => setSocket(null), 5000);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const registerHandler = (handler) => {
        handlersRef.current.add(handler);
        return () => {
            handlersRef.current.delete(handler);
        };
    };


    const send = (data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        }
    };

    const requestUserStatus = (username) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "get_status",
                username: username
            }));
        }
    };

    const requestMultipleUserStatuses = (usernames) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "get_multiple_status",
                usernames: usernames
            }));
        }
    };

    const getUserStatus = (username) => {
        return userStatuses[username] || { status: 'offline', last_seen: null };
    };

    const formatLastSeen = (lastSeenIso) => {
      if (!lastSeenIso) return null;
    
      const lastSeen = new Date(lastSeenIso);
      const now = new Date();
    
      const nowWithOffset = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    
      const diffInMinutes = Math.floor((nowWithOffset - lastSeen) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'recently';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days} days ago`;
        }
    };

    const value = {
        socket,
        registerHandler,
        send,
        userStatuses,
        requestUserStatus,
        requestMultipleUserStatuses,
        getUserStatus,
        formatLastSeen
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