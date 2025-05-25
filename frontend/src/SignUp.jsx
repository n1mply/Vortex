import { useState, useEffect } from "react";
import CustomInput from "./Input";
import logo from '/vortex.svg';
import { At, Eye, EyeSlash, X, Check, User } from "phosphor-react";
import './SignUp.css';

export default function SignUp({}) {
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState({ type: 'password', show: false });

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const [passwordCriteria, setPasswordCriteria] = useState([false, false, false, false]);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleCheck = () => {
        let security_lvl = 0
        passwordCriteria.forEach((bool)=>{
            if (bool){
                security_lvl+=1
            }
        })
        if (security_lvl===4){
            console.log(security_lvl)
            console.log(email, password)
            setStep(3)
        }
    }

    const handleSubmit = () => {
        console.log('Final submission:', { email, password, username });
        // Здесь будет логика отправки данных
    }

    const checkPasswordCriteria = (pwd) => {
        const newCriteria = [
            pwd.length >= 8,
            /[0-9]/.test(pwd),
            /[A-Z]/.test(pwd),
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)
        ];
        setPasswordCriteria(newCriteria);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            checkPasswordCriteria(newPassword);
        }, 200));
    };

    const handlePasswordBlur = () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        checkPasswordCriteria(password);
    };

    return (
        <div className="signup-container">
            <div 
                className="steps-wrapper" 
                style={{ transform: `translateX(-${(step - 1) * 33.333333}%)` }}
            >
                {/* Step 1 */}
                <div className="step-content">
                    <div className="start">
                        <div className="center">
                            <div className="logo-label">
                                <div className="logo-container">
                                    <img src={logo} alt='vortex' />
                                    <h1>Vortex</h1>
                                    <div className="center">
                                        <p>First react and fastest messaging app in the world.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="button-container">
                                <button onClick={() => setStep(2)}>Start Messaging</button>
                            </div>
                                <div className="steps-dots">
                                    {[1, 2, 3].map((steps) => (
                                <div key={steps} className={`dot ${steps === step ? 'active' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="step-content">
                    <div className="start">
                        <div className="center">
                            <div className="logo-label">
                                <h1>First Step</h1>
                                <div className="center">
                                    <p>Enter your email and create secure password</p>
                                </div>
                            </div>
                            <CustomInput value={email} onChange={(e)=>(setEmail(e.target.value))} type={'email'} required label='Your email'>
                                <At size={32} color="#ffffff" />
                            </CustomInput>

                            <div className="queries">
                                <div className="query">
                                    {passwordCriteria[0] ? <Check size={20} color="#00ff00" /> : <X size={20} color="#717171" />}
                                    <p>Password must be at least 8 characters long.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[1] ? <Check size={20} color="#00ff00" /> : <X size={20} color="#717171" />}
                                    <p>The password must contain at least one number.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[2] ? <Check size={20} color="#00ff00" /> : <X size={20} color="#717171" />}
                                    <p>The password must contain a capital letter.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[3] ? <Check size={20} color="#00ff00" /> : <X size={20} color="#717171" />}
                                    <p>The password must contain at least one special character.</p>
                                </div>
                            </div>

                            <CustomInput
                                type={showPass.type}
                                label='Password'
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                required
                            >
                                {!showPass.show && <EyeSlash onClick={() => { setShowPass({ type: 'text', show: true }) }} size={32} color="#ffffff" />}
                                {showPass.show && <Eye onClick={() => { setShowPass({ type: 'password', show: false }) }} size={32} color="#ffffff" />}
                            </CustomInput>
                            <button onClick={() => handleCheck()}>Continue</button>
                            <div className="steps-dots">
                                {[1, 2, 3].map((steps) => (
                                    <div key={steps} className={`dot ${steps === step ? 'active' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="step-content">
                    <div style={{width: '100%'}} className="start">
                        <div style={{width: '100%'}} className="center">
                            <div className="logo-label">
                                <h1>Almost Done!</h1>
                                <div className="center">
                                    <p style={{width: '100%'}}>Create your username</p>
                                </div>
                            </div>
                            <CustomInput
                              type={'text'}
                              required
                              label='Username'
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            >
                              <User size={32} color="#ffffff" />
                            </CustomInput>
                            <button onClick={() => handleSubmit()}>Finish</button>
                            <div style={{marginTop:'20px'}} className="steps-dots">
                                {[1, 2, 3].map((steps) => (
                                    <div key={steps} className={`dot ${steps === step ? 'active' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}