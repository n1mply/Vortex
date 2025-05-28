import api from "./api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function SessionCheck({}){
    const navigator = useNavigate()
    useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/protected");
        console.log('Status ',response.status)
        if (response.status === 401) {
          navigator('/signup')
        }
      } catch (error) {
          navigator('/signup')
      }
    };

    checkSession();
  }, [api]);
    return null
}