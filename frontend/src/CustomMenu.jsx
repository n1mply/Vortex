import { useEffect, useState } from "react";
import './CustomMenu.css'
import api from "./api";

export default function CustomMenu({children, isActive, ref}){
    const [user, setUser] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await api.get(`/protected`);
            console.log(response)
            setUser(response.data.username);
        } catch (error) {
            console.error("Unautharazed:", error);
        } 
    };
    fetchUser();
    }, [api]);

    return (
        <aside ref={ref} className='sidebar' style={{
                position: 'absolute',  
                top: '55px', 
                left: '8px', 
                opacity: isActive ? '1' : '0',
                scale: isActive ? '1' : '0.95',
                transition: 'all 0.3s ease',
                pointerEvents: isActive ? 'auto' : 'none',
                transform: isActive ? 'none' : 'translate(-10px, -10px)',
                }}>
                <div className="profile">
                <div className="option">
                    <div className="avatar">
                        {user[0]}
                    </div>
                    <p>{user}</p>
                </div>
                </div>

                {children}
        </aside>
    )
}