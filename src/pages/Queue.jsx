import React, { useEffect, useState } from 'react'
import { getQueue, updateQueue } from '../services/RecepService.jsx'

export default function Queue() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [queueId, setQueueId] = useState('')
  const [queueStatus, setQueueStatus] = useState('in-progress')

  const normalizeToArray = (data) => {
    const source = data?.data ?? data?.result ?? data?.queue ?? data
    if (Array.isArray(source)) return source
    if (source && typeof source === 'object') return [source]
    return []
  }

  const loadQueue = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getQueue()
      setRows(normalizeToArray(res))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [])

  const handleStatusChange = async (id, status) => {
    if (!id) return
    setError('')
    setMessage('')
    try {
      const res = await updateQueue(id, { status })
      setMessage(res?.message || 'Queue updated successfully.')
      await loadQueue()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update queue')
    }
  }

  const getAllowedNextStatuses = (currentStatus) => {
    const status = String(currentStatus || '').toLowerCase()
    if (status === 'waiting') return ['in-progress', 'skipped']
    if (status === 'in-progress') return ['done']
    return []
  }

  const handleManualUpdate = async () => {
    if (!queueId.trim()) {
      setError('Queue ID is required.')
      return
    }
    await handleStatusChange(queueId.trim(), queueStatus)
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Queue</h3>
        <button className="btn btn-sm btn-secondary" onClick={loadQueue}>Refresh</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-3">Update Queue Status</h6>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Queue ID"
                value={queueId}
                onChange={(e) => setQueueId(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={queueStatus}
                onChange={(e) => setQueueStatus(e.target.value)}
              >
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
                <option value="skipped">skipped</option>
              </select>
            </div>
            <div className="col-md-4 d-grid">
              <button type="button" className="btn btn-primary" onClick={handleManualUpdate}>
                Update
              </button>
            </div>
          </div>
          <p className="small text-muted mt-2 mb-0">
            Allowed transitions: waiting → in-progress/skipped, in-progress → done.
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading queue...</p>
      ) : rows.length === 0 ? (
        <p>data not found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>id</th>
                <th>tokenNumber</th>
                <th>status</th>
                <th>queueDate</th>
                <th>appointmentId</th>
                <th>patientName</th>
                <th>phone</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const rowId = row.id || row._id
                return (
                  <tr key={rowId || index}>
                    <td>{String(row?.id ?? '-')}</td>
                    <td>{String(row?.tokenNumber ?? '-')}</td>
                    <td>{String(row?.status ?? '-')}</td>
                    <td>{String(row?.queueDate ?? '-')}</td>
                    <td>{String(row?.appointmentId ?? '-')}</td>
                    <td>{String(row?.appointment?.patient?.name ?? '-')}</td>
                    <td>{String(row?.appointment?.patient?.phone ?? '-')}</td>
                    <td>
                      {(() => {
                        const options = getAllowedNextStatuses(row.status)
                        if (!options.length) {
                          return <span className="text-muted">No transition</span>
                        }
                        return (
                      <select
                        className="form-select form-select-sm"
                        defaultValue=""
                        onChange={(e) => handleStatusChange(rowId, e.target.value)}
                        disabled={!rowId}
                      >
                        <option value="" disabled>Select</option>
                        {options.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                        )
                      })()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
