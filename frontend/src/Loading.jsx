import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hurricane from '/hurricane.svg';
import vletter from '/v.svg';

export default function Loading({ children, redirectTo, immLoadTime = 1 , reload=false}) {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(redirectTo);
            if (reload){
                console.log('reload')
                location.reload()
            }
        }, immLoadTime * 1000);

        return () => clearTimeout(timer);
    }, [navigate, redirectTo, immLoadTime]);

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: "center", 
            flexDirection: 'column', 
            height: "100vh", 
            justifyContent: 'center',
        }}>
            <div className="logo">
                <img 
                    className='logo-h' 
                    src={hurricane} 
                    alt="h"
                />
                <img 
                    src={vletter} 
                    alt="v" 
                />
            </div>
            <h1 style={{
                fontSize: '20px', 
                color: '#fff', 
                textAlign: 'center', 
                fontWeight: 550,
            }}>
                {children}
            </h1>
        </div>
    );
}