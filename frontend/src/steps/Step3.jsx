import { useSignUp } from '../SignUpContext';
import { User } from "phosphor-react";
import CustomInput from '../Input';
import '../SignUp.css';

export default function Step3() {
  const { step, formData, updateFormData, handleSubmit } = useSignUp();

  return (
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
                      value={formData.username}
                      onChange={(e) => updateFormData('username', e.target.value)}
                      label={'Username'}>
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
  );
}