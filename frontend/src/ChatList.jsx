import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

export default function ChatList({}){
    const navigator = useNavigate()
    const {chats} = useOutletContext()

    return (
            <div className="messenger">
                {chats.map((chat)=>(
                    <div className="chat" key={chat.user_id} onClick={()=>(navigator(`/m/${chat.user_id}`))}> 
                        <div className="avatar">
                            {chat.username[0]}
                        </div>
                    <div className="chat-info">
                        <div className="name-n-time">
                            <p className="username">{chat.username}</p>
                            <p className="date">{new Date(new Date(chat.last_time).getTime() + 10800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="last-message">
                            {chat.last_message}
                        </div>
                    </div>
                    </div>
                ))}
            </div>
    )
}