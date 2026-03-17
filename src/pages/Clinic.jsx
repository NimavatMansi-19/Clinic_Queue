
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClinic } from '../services/tableService.jsx'

function Clinic() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])

  const getClinicdata = async () => {
    const data = await getClinic()
    console.log(data)

    const source = data?.data ?? data?.result ?? data?.clinics ?? data
    const list = Array.isArray(source)
      ? source
      : source && typeof source === 'object'
      ? [source]
      : []

    setRows(Array.isArray(list) ? list : [])
  }

  useEffect(() => {
    getClinicdata()
  }, [])

  return (
    <div className="container-fluid">
      <div className="page-title-row">
        <h3 className="page-title">Clinic Data</h3>
        <button
          type="button"
          className="btn-action"
          onClick={() => navigate('/user')}
        >
          View User
        </button>
      </div>

      {rows.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <div className="data-table-container">
          <table className="table">
            <thead>
              <tr>
                {Object.keys(rows[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || row._id || index}>
                  {Object.keys(rows[0]).map((key) => (
                    <td key={`${index}-${key}`}>
                      {typeof row[key] === 'object' && row[key] !== null
                        ? JSON.stringify(row[key])
                        : String(row[key] ?? '-')}
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

export default Clinic
