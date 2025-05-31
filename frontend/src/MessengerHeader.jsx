import search from './assets/icons/search.svg'
import menu from './assets/icons/menu.svg'
import back from './assets/icons/back.svg'
import dots from './assets/icons/dots.svg'
import { useNavigate } from 'react-router-dom';
import './MessengerHeader.css'


export default function MessengerHeader({showSearch, setShowSearch, searchQuery, setSearchQuery, chatName}){
    const isInChat = location.pathname.startsWith('/m/') && location.pathname !== '/m';
    const navigator = useNavigate()

    const relocate = async () => {
        if (isInChat) {
            navigator('/m');
        } else if (showSearch) {
            setShowSearch(false);
            setSearchQuery("");
        }
    };
    return (
            <header>
                <div className={`header-content ${isInChat ? 'header-hidden' : ''}`}>
                    <div className="icon-container">
                        <img 
                            src={menu} 
                            alt="menu" 
                            className="header-icon"
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
                            <div className="chat-status">
                                last seen at 14:22
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
    )
}