import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ChatList({}){
    const navigator = useNavigate()

    return (
            <div className="messenger">
                <div className="chat" onClick={()=>(navigator('/m/1'))}>
                    <div className="avatar">
                        M
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
    )
}