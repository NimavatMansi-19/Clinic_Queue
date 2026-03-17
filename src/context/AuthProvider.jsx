import React, { createContext, useEffect, useState,useContext } from 'react';
import{getToken,getCurrentUser} from "../services/authService.jsx"
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(getCurrentUser());
    }
    setLoading(false);
  }, []);
const loginAuth = (userData) => {
    setUser(userData);
};
const logoutAuth = () => {
    setUser(null);
};
    return (
        <AuthContext.Provider value={{ 
            user,
             loginAuth, 
             logoutAuth,
              loading ,
              isAuthenticated:user!==null,
              isAdmin:user?.role==='admin',
              isPatient:user?.role==='patient',
              isReceptionist:user?.role==='receptionist',
              isDoctor:user?.role==='doctor'
              }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}