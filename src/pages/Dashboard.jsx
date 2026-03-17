import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx';
import { getalldoctor } from '../services/doctorService.jsx';

function Dashboard() {
  const { user, isDoctor } = useAuth();
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const normalizeToArray = (data) => {
    const source = data?.data ?? data?.result ?? data?.queue ?? data
    if (Array.isArray(source)) return source
    if (source && typeof source === 'object') return [source]
    return []
  }

  const loadDoctorQueue = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getalldoctor()
      setQueue(normalizeToArray(res))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isDoctor) {
      loadDoctorQueue()
    }
  }, [isDoctor])

  return (
    <div className="container py-4">
      <h1 className="mb-3">Dashboard {user?.userId ?? 'Guest'}</h1>

      {isDoctor ? (
        <>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="mb-0">Queue For Today</h5>
            <button type="button" className="btn btn-sm btn-secondary" onClick={loadDoctorQueue}>
              Refresh
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <p>Loading queue...</p>
          ) : queue.length === 0 ? (
            <p>No queue data available for today.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>id</th>
                    <th>tokenNumber</th>
                    <th>status</th>
                    <th>patientName</th>
                    <th>patientId</th>
                    <th>appointmentId</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item, index) => (
                    <tr key={item.id || item._id || index}>
                      <td>{String(item?.id ?? '-')}</td>
                      <td>{String(item?.tokenNumber ?? '-')}</td>
                      <td>{String(item?.status ?? '-')}</td>
                      <td>{String(item?.patientName ?? '-')}</td>
                      <td>{String(item?.patientId ?? '-')}</td>
                      <td>{String(item?.appointmentId ?? '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p>Welcome to your dashboard.</p>
      )}
    </div>
  )
}

export default Dashboard;
