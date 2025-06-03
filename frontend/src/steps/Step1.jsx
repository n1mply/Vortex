import { useSignUp } from '../context/SignUpContext';
import hurricane from '/hurricane.svg';
import vletter from '/v.svg';
import '../SignUp.css';

export default function Step1() {
  const { step, setStep } = useSignUp();
    return (
            <div className="step-content">
                <div className="start">
                    <div className="center">
                        <div className="logo-label">
                            <div className="logo-container">
                                <div className="logo">
                                    <img className='logo-h' src={hurricane} alt="h" />
                                    <img src={vletter} alt="v" />
                                </div>
                                <h1>Vortex</h1>
                                <div className="center" style={{marginBottom: '-165px'}}>
                                    <p>First react and fastest messaging app in the world.</p>
                                    <div className="steps-dots">
                                        {[1, 2, 3].map((steps) => (
                                        <div key={steps} className={`dot ${steps === step ? 'active' : ''}`}></div>
                                    ))}
                                    </div>
                                </div>      
                            </div>
                        </div>
                        <div className="button-container">
                            <button onClick={() => setStep(2)}>Start Messaging</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}