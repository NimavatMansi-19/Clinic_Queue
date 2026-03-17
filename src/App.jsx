import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.jsx'
import Layout from './components/layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Clinic from './pages/Clinic.jsx'
import Reports from './pages/Reports.jsx'
import Doctor from './pages/Doctor.jsx'
import Queue from './pages/Queue.jsx'
import Prescriptions from './pages/Prescriptions.jsx'
import Appointments from './pages/Appointments.jsx' 
import AddUser from './pages/AddUser.jsx'
import User from './pages/user.jsx'
function App() {
  

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/" element={<ProtectedRoute ><Layout /></ProtectedRoute>
      }>
        <Route index  element={<Dashboard />} />
        <Route path="/clinic" element={<Clinic />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/AddUser" element={<AddUser />} />

        </Route>
      </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
