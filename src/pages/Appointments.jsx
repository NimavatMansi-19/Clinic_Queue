import React, { useEffect, useMemo, useState } from 'react'
import { bookApp, getByID, getMyAppointments } from '../services/PatientService.jsx'

function Appointments() {
  const [myAppointments, setMyAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [bookForm, setBookForm] = useState({
    appointmentDate: '',
    timeSlot: ''
  })
  const [bookResult, setBookResult] = useState(null)
  const [appointmentId, setAppointmentId] = useState('')
  const [appointmentById, setAppointmentById] = useState(null)
  const [byIdMessage, setByIdMessage] = useState('')

  const formatApiError = (err, fallback) => {
    const data = err?.response?.data
    if (typeof data === 'string') return data
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.error === 'string') return data.error
    if (Array.isArray(data?.errors)) {
      return data.errors
        .map((item) => item?.message || item?.msg || JSON.stringify(item))
        .join(', ')
    }
    return err?.message || fallback
  }

  const normalizeToArray = (data) => {
    const source = data?.data ?? data?.result ?? data?.appointments ?? data
    if (Array.isArray(source)) return source
    if (source && typeof source === 'object') return [source]
    return []
  }

  const loadMyAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMyAppointments()
      setMyAppointments(normalizeToArray(res))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyAppointments()
  }, [])

  const tableColumns = useMemo(() => {
    if (!myAppointments.length) return []
    return Object.keys(myAppointments[0])
  }, [myAppointments])

  const handleBook = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      appointmentDate: bookForm.appointmentDate,
      timeSlot: bookForm.timeSlot
    }

    if (!payload.appointmentDate || !payload.timeSlot) {
      setError('appointmentDate and timeSlot are required.')
      return
    }

    try {
      const res = await bookApp(payload)
      setBookResult(res)
      setBookForm({ appointmentDate: '', timeSlot: '' })
      await loadMyAppointments()
    } catch (err) {
      setError(formatApiError(err, 'Failed to book appointment'))
    }
  }

  const handleGetById = async () => {
    if (!appointmentId.trim()) return
    setError('')
    setByIdMessage('')
    try {
      const res = await getByID(appointmentId.trim())
      const source = res?.data ?? res?.result ?? res
      if (!source || (typeof source === 'object' && Object.keys(source).length === 0)) {
        setAppointmentById(null)
        setByIdMessage('Data not available')
        return
      }
      setAppointmentById(res)
    } catch (err) {
      setAppointmentById(null)
      if (err?.response?.status === 404) {
        setByIdMessage('Data not available')
      } else {
        setError(formatApiError(err, 'Failed to fetch appointment by ID'))
      }
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Appointments</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Book Appointment</h5>
          <form onSubmit={handleBook}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={bookForm.appointmentDate}
                  onChange={(e) =>
                    setBookForm((prev) => ({ ...prev, appointmentDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Time Slot</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="10:00-10:15"
                  value={bookForm.timeSlot}
                  onChange={(e) =>
                    setBookForm((prev) => ({ ...prev, timeSlot: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Book Appointment</button>
          </form>

          {bookResult && (
            <pre className="mt-3 mb-0 bg-light p-3 rounded">{JSON.stringify(bookResult, null, 2)}</pre>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Get Appointment By ID</h5>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Enter appointment id"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            />
            <button type="button" className="btn btn-outline-primary" onClick={handleGetById}>
              Fetch
            </button>
          </div>

          {appointmentById && (
            <pre className="mt-3 mb-0 bg-light p-3 rounded">{JSON.stringify(appointmentById, null, 2)}</pre>
          )}
          {byIdMessage && <p className="text-danger mt-3 mb-0">{byIdMessage}</p>}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0">My Appointments</h5>
        <button type="button" className="btn btn-sm btn-secondary" onClick={loadMyAppointments}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : myAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                {tableColumns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myAppointments.map((row, index) => (
                <tr key={row.id || row._id || index}>
                  {tableColumns.map((col) => (
                    <td key={`${index}-${col}`}>
                      {typeof row[col] === 'object' && row[col] !== null
                        ? JSON.stringify(row[col])
                        : String(row[col] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Appointments
