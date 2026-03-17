import React, { useEffect, useMemo, useState } from 'react'
import { getMyPrescriptions, postprescriptionByID } from '../services/doctorService.jsx'
import { useAuth } from '../context/AuthProvider.jsx'

export default function Prescriptions() {
  const { isDoctor } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [prescriptionText, setPrescriptionText] = useState(
    JSON.stringify(
      {
        medicines: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            duration: '5 days'
          }
        ],
        notes: 'After food'
      },
      null,
      2
    )
  )

  const normalizeToArray = (data) => {
    const source = data?.data ?? data?.result ?? data?.prescriptions ?? data
    if (Array.isArray(source)) return source
    if (source && typeof source === 'object') return [source]
    return []
  }

  const loadPrescriptions = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMyPrescriptions()
      setRows(normalizeToArray(res))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch prescriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDoctor) {
      loadPrescriptions()
    }
  }, [isDoctor])

  const columns = useMemo(() => {
    if (!rows.length) return []
    return Object.keys(rows[0])
  }, [rows])

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

  const getPrescriptionErrorMessage = (err) => {
    const status = err?.response?.status
    const raw = formatApiError(err, 'Failed to post prescription')
    const text = String(raw).toLowerCase()

    if (
      status === 409 ||
      text.includes('already') ||
      text.includes('exists') ||
      text.includes('duplicate') ||
      text.includes('one prescription')
    ) {
      return 'Prescription already added for this appointment.'
    }

    if (
      status === 404 ||
      text.includes('invalid appointment') ||
      text.includes('appointment not found') ||
      text.includes('not found')
    ) {
      return 'Invalid appointment ID.'
    }

    return raw
  }

  const handlePostPrescription = async (id) => {
    if (!id) return
    setError('')
    setActionMessage('')
    try {
      const payload = JSON.parse(prescriptionText)
      if (!Array.isArray(payload?.medicines) || payload.medicines.length === 0) {
        setError('medicines must be a non-empty array.')
        return
      }
      const res = await postprescriptionByID(id, payload)
      setActionMessage(res?.message || 'Prescription posted successfully.')
      if (!isDoctor) {
        await loadPrescriptions()
      }
      setAppointmentId('')
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid prescription JSON format.')
        return
      }
      setError(getPrescriptionErrorMessage(err))
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Prescriptions</h3>
        <button className="btn btn-sm btn-secondary" onClick={loadPrescriptions} disabled={isDoctor}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      {isDoctor && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add Prescription By Appointment ID</h5>
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter appointment ID"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
              />
            </div>
            <label className="form-label">Prescription JSON</label>
            <textarea
              className="form-control mb-3"
              rows="10"
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handlePostPrescription(appointmentId.trim())}
              disabled={!appointmentId.trim()}
            >
              Add Prescription
            </button>
          </div>
        </div>
      )}

      {!isDoctor && (loading ? (
        <p>Loading prescriptions...</p>
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
                {isDoctor && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const rowId = row.id || row._id
                return (
                  <tr key={rowId || index}>
                    {columns.map((col) => (
                      <td key={`${index}-${col}`}>
                        {typeof row[col] === 'object' && row[col] !== null
                          ? JSON.stringify(row[col])
                          : String(row[col] ?? '-')}
                      </td>
                    ))}
                    {isDoctor && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          disabled={!rowId}
                          onClick={() => handlePostPrescription(rowId)}
                        >
                          Post Prescription
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
