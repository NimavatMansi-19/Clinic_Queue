import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'

function ProtectedRoute({children}) {
    const navigate=useNavigate();
    const {loading,isAuthenticated}=useAuth();
    useEffect(()=>{
       if(!loading && !isAuthenticated){
        navigate('/login')
       }
    },[loading, isAuthenticated])
  return children;
    
}

export default ProtectedRoute;
