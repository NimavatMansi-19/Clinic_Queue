import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './addUser.css'
import { insertUsers } from '../services/tableService'

export default function AddUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim()
      }

      const res = await insertUsers(payload)
      setSuccess(res?.message || 'User created successfully.')
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'doctor',
        phone: ''
      })
      navigate('/user')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Request failed. Please check input values.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-user-page">
      <div className="add-user-card">
        <div className="add-user-header">
          <h2>Add User</h2>
          <p>Create a new account with role-based access.</p>
        </div>

        <form className="add-user-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {success && <div className="alert alert-success mb-3">{success}</div>}

          <div className="form-grid">
            <div className="form-field form-field-full">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="655421212"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  )
}
