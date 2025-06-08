import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ChatWindow.css';
import api from "./api";
import { useWebSocket } from "./context/WebsocketContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChat } from "./context/ChatContext";
import ParticlesBackground from "./Background";

export default function ChatWindow() {
    const navigator = useNavigate();
    const { currentUser, currentChat } = useChat();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const textareaRef = useRef(null);
    const messageSendRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { send, registerHandler } = useWebSocket();

    // useEffect(() => {
    //   if (messages.length > 0) {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    //   }
    // }, [messages]);


    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await api.get(`/messages/${currentChat}`);
                setMessages(response.data.history);
            } catch (error) {
                console.error("Can't get chat history:", error);
            }
        };
        loadHistory();
    }, [currentChat]);

    useEffect(() => {
      if (!currentUser || !currentChat) return;

      send({ receiver: currentChat });

      const unregister = registerHandler((data) => {
        if (data.type === "history") {
          setMessages(data.messages);
        } else if (data.type === "new_message") {
          const msg = data.message;
          if (
            (msg.sender === currentChat && msg.receiver === currentUser) ||
            (msg.sender === currentUser && msg.receiver === currentChat)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      });

    return unregister;
    }, [currentUser, currentChat, registerHandler, send]);

    const sendMessage = () => {
        if (!message.trim() || !currentUser) return;

        const messageData = {
            receiver: currentChat,
            text: message,
        };

        send(messageData);
        setMessage("");
    };


    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;

            if (messageSendRef.current) {
                const newHeight = Math.min(Math.max(textarea.scrollHeight, 58), 200);
                messageSendRef.current.style.height = `${newHeight}px`;
            }
        }
    }, [message]);

    const parseMessage = (text) => {
        const parts = text.split(/(```[\s\S]*?```)/g);
        return parts.map((part, i) => {
            if (part.startsWith("```") && part.endsWith("```")) {
                const code = part.slice(3, -3).trim();
                return (
                    <SyntaxHighlighter
                        key={i}
                        language="python"
                        style={oneDark}
                        customStyle={{ borderRadius: "0.5rem", padding: "1rem" }}
                    >
                        {code}
                    </SyntaxHighlighter>
                );
            } else {
                return <p key={i}>{part}</p>;
            }
        });
    };

    return (
        <div style={{ zIndex: 200, position: 'relative'}} className="messenger-chat">
            <ParticlesBackground></ParticlesBackground>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === currentUser ? "sended" : "received"}>
                        <div className="msg">
                            <div className="message-text">
                                {parseMessage(msg.text)}
                            </div>
                            <p className="time">
                                {new Date(new Date(msg.timestamp).getTime() + 10800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{opacity: currentChat===null ? '0' : '1', transition: '0.2s opacity ease'}} className="message-send" ref={messageSendRef}>
                <div className="message-input">
                    <div className="bottom-aligned">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#707579" viewBox="0 0 256 256"><path d="M174.92,156c-10.29,17.79-27.39,28-46.92,28s-36.63-10.2-46.93-28a8,8,0,1,1,13.86-8c7.46,12.91,19.2,20,33.07,20s25.61-7.1,33.08-20a8,8,0,1,1,13.84,8ZM232,128a104.35,104.35,0,0,1-4.56,30.56,8,8,0,0,1-2,3.31l-63.57,63.57a7.9,7.9,0,0,1-3.3,2A104,104,0,1,1,232,128Zm-16,0a87.89,87.89,0,1,0-64,84.69L212.69,152A88.05,88.05,0,0,0,216,128ZM92,120a12,12,0,1,0-12-12A12,12,0,0,0,92,120Zm72-24a12,12,0,1,0,12,12A12,12,0,0,0,164,96Z"></path></svg>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        rows="1"
                    />
                    <div className="bottom-aligned">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#707579" viewBox="0 0 256 256"><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path></svg>
                    </div>
                </div>
                <div className="send-button" onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#a044ff" viewBox="0 0 256 256"><path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"></path></svg>
                </div>
            </div>
        </div>
    );
}
