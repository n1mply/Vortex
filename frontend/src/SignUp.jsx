import { useState } from 'react';
import { SignUpContext } from './SignUpContext';
import api from './api';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

export default function SignUp() {
  const navigator = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [showPass, setShowPass] = useState({ type: 'password', show: false });
  const [mistakes, setMistakes] = useState('#717171');
  const [passwordCriteria, setPasswordCriteria] = useState([false, false, false, false]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkPasswordCriteria = (pwd) => {
    const newCriteria = [
      pwd.length >= 8,
      /[0-9]/.test(pwd),
      /[A-Z]/.test(pwd),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)
    ];
    setPasswordCriteria(newCriteria);
    return newCriteria.every(c => c);
  };

const handleSubmit = async () => {
  try {
    const responseUp = await api.post('/register', formData);
    console.log('Success:', responseUp.data);
    const responseIn = await api.post("/login", { username: formData.username, password: formData.password });
    console.log(responseIn.data.message)
    if (responseIn.data.message==="Success"){
      setIsLoading(true)
    }


  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};


  const value = {
    step,
    setStep,
    formData,
    updateFormData,
    showPass,
    setShowPass,
    mistakes,
    setMistakes,
    passwordCriteria,
    checkPasswordCriteria,
    handleSubmit,
    typingTimeout, 
    setTypingTimeout
  };
  if (isLoading===true){
    return <Loading redirectTo={'/m'} immLoadTime={3} reload={true} >Creating Your Account..</Loading>
  }

  return (
  <>
    <SignUpContext.Provider value={value}>
      <div className="signup-container">
        <div 
          className="steps-wrapper" 
          style={{ transform: `translateX(-${(step - 1) * 33.333333}%)` }}>
          <Step1 />
          <Step2 />
          <Step3 />
        </div>
      </div>
    </SignUpContext.Provider>
  </>

  );
}