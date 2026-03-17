import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService.jsx'
import { useAuth } from '../context/AuthProvider.jsx'
import './login.css'


export default function Login() {
const [data, setData] = useState({email:"", password:""})
const [error, setError] = useState(null)
const navigate=useNavigate();
const { loginAuth } = useAuth();
const handlesubmit= async(e)=>{
  e.preventDefault()
  const res=await login(data);
  if(res.error){
    setError(res.error)
  }else{
    const decoded = JSON.parse(atob(res.token.split('.')[1]));
    loginAuth(decoded);
    navigate('/')
  }
 
//   if (data.email === 'admin@example.com' && data.password === 'password') {
//     navigate('/dashboard')
//   } else {
//     setError('Invalid email or password')
//   }
}

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <div className="clinic-icon">
            
          </div>
          <h1>Clinic Queue</h1>
          <p>Sign in to manage patient queues</p>
        </div>

        {/* Form */}
        <div className="login-body">
          <form>

            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                    onChange={(e)=>setData({...data,email:e.target.value})}
                 
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <div className="input-group">
               
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                onChange={(e)=>setData({...data,password:e.target.value})}

                />
               
               
              </div>
            </div>

          

            <button type="submit" onClick={handlesubmit} className="btn-login">Sign In</button>

          </form>
        </div>

       

      </div>
    </div>
  )
}
