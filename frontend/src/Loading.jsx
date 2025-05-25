import hurricane from '/hurricane.svg'
import vletter from '/v.svg'

export default function Loading({children}){
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="logo">
                <img className='logo-h' src={hurricane} alt="h" />
                <img src={vletter} alt="v" />
            </div>
            <h1 style={{fontSize: '20px', color:'#fff', textAlign: 'center', fontWeight: 550}}>{children}</h1>
        </div>

    )
}