import { createContext,useState } from "react";
import api from "../api/Axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );
    
const login = (userData) =>{
    localStorage.setItem("user", JSON.stringify(userData.data.user));
    setUser(userData.data.user);
}

const logout =async ()=>{
    try{
        await api.post("/users/logout", {});
        localStorage.removeItem("user");
        setUser(null); 
    }catch(err){
        console.error("Logout failed:", err);
    }
    
}
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}