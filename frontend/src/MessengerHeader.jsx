import search from './assets/icons/search.svg'
import menu from './assets/icons/menu.svg'
import back from './assets/icons/back.svg'
import dots from './assets/icons/dots.svg'
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from './context/WebsocketContext';
import CustomMenu from './CustomMenu';
import './MessengerHeader.css'

export default function MessengerHeader({showSearch, setShowSearch, searchQuery, setSearchQuery, chatName}){
    const isInChat = location.pathname.startsWith('/m/') && location.pathname !== '/m';
    const [isSettingsActive, setIsSettingsActive] = useState(false)
    const navigator = useNavigate()
    const menuRef = useRef(null);
    const { getUserStatus, formatLastSeen, requestUserStatus } = useWebSocket();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsSettingsActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isInChat && chatName) {
            requestUserStatus(chatName);
        }
    }, [isInChat, chatName, requestUserStatus]);

    const relocate = async () => {
        if (isInChat) {
            navigator('/m');
        } else if (showSearch) {
            setShowSearch(false);
            setSearchQuery("");
        }
    };

    const userStatus = chatName ? getUserStatus(chatName) : null;

    const getStatusText = () => {
        if (!userStatus) return 'offline';
        
        if (userStatus.status === 'online') {
            return 'online';
        } else {
            const lastSeenText = formatLastSeen(userStatus.last_seen);
            return lastSeenText ? `last seen ${lastSeenText}` : 'offline';
        }
    };

    return (
        <>
            <header>
                <div style={{position: 'relative'}} className={`header-content ${isInChat ? 'header-hidden' : ''}`}>
                    <div className="icon-container">
                        <img
                            src={menu}
                            alt="menu"
                            className="header-icon"
                            onClick={()=>(setIsSettingsActive(!isSettingsActive))}
                            style={{
                                position: 'absolute',
                                opacity: showSearch ? 0 : 1,
                                transition: 'opacity 0.3s ease',
                            }}/>
                        <img
                            src={back}
                            alt="back"
                            className="header-icon"
                            style={{
                                position: 'absolute',
                                opacity: showSearch ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                pointerEvents: showSearch ? 'auto' : 'none'
                            }}
                            onClick={relocate}
                        />
                    </div>
                    <h1 style={{ opacity: !showSearch ? 1 : 0 }}>Vortex</h1>
                    <div style={{ width: !showSearch ? '' : '80%' }} className="search-wrapper">
                        <img src={search} alt="search"/>
                        <input
                            type="text"
                            placeholder="Search"
                            onFocus={() => setShowSearch(true)}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={`chat-header ${isInChat ? 'chat-header-visible' : ''}`}>
                    <div className="icon-container">
                        <img
                            src={back}
                            alt="back"
                            className="header-icon"
                            onClick={relocate}
                        />
                    </div>
                    <div className="chat-header-info">
                        <div className="avatar">
                            {chatName ? chatName[0] : ' '}
                        </div>
                        <div className="chat-user-info">
                            <p className="chat-name">
                                {chatName}
                            </p>
                            <div className={`chat-status ${userStatus?.status === 'online' ? 'online' : 'offline'}`}>
                                {getStatusText()}
                            </div>
                        </div>
                    </div>
                    <div className="icon-container">
                        <img
                            src={dots}
                            alt="menu"
                            className="header-icon"
                        />
                    </div>
                </div>
            </header>
            <CustomMenu ref={menuRef} isActive={isSettingsActive}>
                <div className="option">
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path></svg>
                    </div>
                    <p>Settings</p>
                </div>
                <div className="option">
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 256 256"><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path></svg>
                    </div>
                    <p>Logout</p>
                </div>
            </CustomMenu>
        </>
    )
}