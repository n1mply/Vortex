import { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import api from './api';
import './Messenger.css';
import MessengerHeader from "./MessengerHeader";
import { useWebSocket } from "./context/WebsocketContext.jsx";
import useWindowWidth from './hooks/windowWidth.jsx';
import ChatWindow from './ChatWindow.jsx';
import ChatList from './ChatList.jsx';
import { ChatProvider } from "./context/ChatContext";

export default function MessengerLayout() {
    const windowWidth = useWindowWidth();
    const navigator = useNavigate();
    const userId = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [chats, setChats] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);

    const { registerHandler } = useWebSocket();


    useEffect(() => {
        const unregister = registerHandler((data) => {
        if (data.type === "chats_updated") {
            fetchChats();
        }
        });
        return unregister;
    }, [registerHandler]);


    const searchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/user/search/${query}`);
            setSearchResults(response.data.users || []);
            console.log(response.data)
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (searchQuery) {
            timeoutRef.current = setTimeout(() => {
                searchUsers(searchQuery);
            }, 500)
        } else {
            setSearchResults([]);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchQuery]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
        try {
            const response = await api.get("/protected");
            setCurrentUser(response.data.username);
        } catch (error) {
            console.error("User not found:", error);
        } 
    };
    fetchCurrentUser();
    }, [api]);

    useEffect(() => {
        const fetchCurrentChat = async () => {
        try {
            console.log(userId.userId)
            const response = await api.get(`/user/id/${userId.userId}`);
            console.log(response)
            setCurrentChat(response.data.username);
        } catch (error) {
            console.error("User not found:", error);
        } 
    };
    fetchCurrentChat();
    }, [api, userId]);


    const fetchChats = async () =>{
        try{
            const response = await api.get('/chats/get')
            setChats(response.data.chats)
            setIsLoading(false)
            console.log(response.data.chats)
        } catch (error){
            console.error(error)
            }
        }


    useEffect(()=>{
        fetchChats()
    }, [api])
    
    const chatContextValue = {
        currentUser,
        setCurrentUser,
        currentChat,
        setCurrentChat,
        chats,
        setChats,
        fetchChats,
        isLoading,
        showSearch,
        setShowSearch,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults
    };

    return (
         <ChatProvider value={chatContextValue}>
        <div style={{ position: 'relative' }}>
            <MessengerHeader 
            showSearch={showSearch}
            setShowSearch={setShowSearch} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            chatName={currentChat}
            >
            </MessengerHeader>

            <div style={{ display: showSearch ? 'flex' : 'none' , zIndex: '100'}} className="search-select">
                {isLoading ? (
                    <div style={{color: '#fff'}} className="loading">...</div>
                ) : searchResults.length > 0 ? (
                    searchResults.map(user => (
                        <div className="chat" key={user.id || user.username} onClick={()=>(navigator(`/m/${user.id}`))}>
                            <div className="avatar">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="chat-info">
                                <div className="name-n-time">
                                    <p className="username">{user.username}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p style={{color: '#fff'}}>{searchQuery ? "No users found" : "Start typing to search"}</p>
                    </div>
                )}
            </div>
            <div className="chat-window">
                {windowWidth >= 850 ? (
                <>
                    <ChatList />
                    <ChatWindow />
                </>
                ) : (
                    <Outlet></Outlet>
                )}
                
            </div>
        </div>
        </ChatProvider>
    )
}