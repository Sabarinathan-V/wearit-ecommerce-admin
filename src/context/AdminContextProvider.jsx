import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

export default function AdminContextProvider({children}){

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");

    const navigate = useNavigate();

    const currency = "$";

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    const value = {token, setToken, navigate, currency}

    return(
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}