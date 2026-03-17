import React, { useEffect, useMemo, useState } from 'react'
import { getalldoctor } from '../services/doctorService.jsx'

export default function Doctor() {
  const [rows, setRows] = useState([])
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
      setRows(normalizeToArray(res))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch doctor queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctorQueue()
  }, [])

  const columns = useMemo(() => {
    if (!rows.length) return []
    return Object.keys(rows[0])
  }, [rows])

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Doctor Queue</h3>
        <button className="btn btn-sm btn-secondary" onClick={loadDoctorQueue}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading doctor queue...</p>
      ) : rows.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || row._id || index}>
                  {columns.map((col) => (
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
