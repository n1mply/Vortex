import { useSignUp } from '../context/SignUpContext';
import CustomInput from '../Input';
import { At, Eye, EyeSlash, X, Check } from "phosphor-react";
import '../SignUp.css';

export default function Step2() {
  const {
    formData,
    updateFormData,
    step,
    setStep,
    showPass,
    setShowPass,
    mistakes,
    setMistakes,
    passwordCriteria,
    checkPasswordCriteria,
    typingTimeout, 
    setTypingTimeout
  } = useSignUp();

  const handleContinue = () => {
    const isValid = passwordCriteria.every(c => c);
    if (isValid) setStep(3);
    else setMistakes('#ff1f44');
  }

    const handlePasswordBlur = () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        checkPasswordCriteria(formData.password);
    };

    return (
                <div className="step-content">
                    <div className="start">
                        <div className="center">
                            <div className="logo-label">
                                <h1>First Step</h1>
                                <div className="center">
                                    <p>Enter your email and create secure password</p>
                                </div>
                            </div>
                            <CustomInput value={formData.email} onChange={(e)=>(updateFormData('email', e.target.value))} type={'email'} required label='Your email'>
                                <At size={32} color="#ffffff" />
                            </CustomInput>
                            <div className="queries">
                                <div className="query">
                                    {passwordCriteria[0] ? <Check size={20} color="#00ff00" /> : <X size={20} color={mistakes} />}
                                    <p>Password must be at least 8 characters long.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[1] ? <Check size={20} color="#00ff00" /> : <X size={20} color={mistakes} />}
                                    <p>Password must contain at least one number.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[2] ? <Check size={20} color="#00ff00" /> : <X size={20} color={mistakes} />}
                                    <p>Password must contain a capital letter.</p>
                                </div>
                                <div className="query">
                                    {passwordCriteria[3] ? <Check size={20} color="#00ff00" /> : <X size={20} color={mistakes} />}
                                    <p>Password must contain at least one special character.</p>
                                </div>
                            </div>
                            <CustomInput
                                type={showPass.type}
                                label='Password'
                                value={formData.password}
                                onChange={(e) => {
                                        updateFormData('password', e.target.value);
                                        checkPasswordCriteria(e.target.value);
                                }}
                                onBlur={handlePasswordBlur}
                                required
                            >
                                {!showPass.show && <EyeSlash onClick={() => { setShowPass({ type: 'text', show: true }) }} size={32} color="#ffffff" />}
                                {showPass.show && <Eye onClick={() => { setShowPass({ type: 'password', show: false }) }} size={32} color="#ffffff" />}
                            </CustomInput>
                            <button onClick={() => handleContinue()}>Continue</button>
                            <div className="steps-dots">
                                {[1, 2, 3].map((steps) => (
                                    <div key={steps} className={`dot ${steps === step ? 'active' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    )
}