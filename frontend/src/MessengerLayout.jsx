import { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import search from './assets/icons/search.svg'
import menu from './assets/icons/menu.svg'
import back from './assets/icons/back.svg'
import api from './api'
import './Messenger.css'

export default function MessengerLayout() {
    const navigator = useNavigate()
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);


    const relocate = async () => {
        setShowSearch(false)
        setSearchQuery("")
        navigator('/m')
    }


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

    return (
        <div style={{ position: 'relative' }}>
            <header>
            <div className="icon-container" style={{ position: 'relative', width: '24px', height: '24px'}}>
                <img 
                    src={menu} 
                    alt="menu" 
                    style={{
                        position: 'absolute',
                        opacity: showSearch ? 0 : 1,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: showSearch ? 'none' : 'auto'
                    }}
                />
                <img 
                    src={back} 
                    alt="back" 
                    style={{
                        position: 'absolute',
                        opacity: showSearch ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: showSearch ? 'auto' : 'none'
                    }}
                    onClick={relocate}
                />
                </div>
                <h1 style={{opacity: !showSearch ? 1 : 0}} >Vortex</h1>
                <div style={{width: !showSearch ? '': '80%'}} className="search-wrapper">
                    <img src={search} alt="s"/>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        onFocus={() => setShowSearch(true)}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

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
                <Outlet></Outlet>
            </div>
        </div>
    )
}