import { createContext, useContext } from 'react';

export const SignUpContext = createContext();
export const useSignUp = () => useContext(SignUpContext);