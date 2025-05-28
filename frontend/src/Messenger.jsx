import { PencilSimple } from "phosphor-react";
import search from './assets/icons/search.svg'
import menu from './assets/icons/menu.svg'
import './Messenger.css'


export default function Messenger({}){

    return (
        <div style={{}}>
            <header>
                <img src={menu} alt="menu" />
                <h1>Vortex</h1>
                <div className="search-wrapper">
                    <img src={search} alt="s" />
                    <input type="text" placeholder="Search" />
                </div>
            </header>
            <div className="messenger">
                <div className="chat">
                    <div className="avatar">
                        m
                    </div>
                    <div className="chat-info">
                        <div className="name-n-time">
                            <p className="username">masha</p>
                            <p className="date">12:22</p>
                        </div>
                        <div className="last-message">
                            Слушай, я хотела тебе кое-что сказать..
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}