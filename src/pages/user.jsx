import React from 'react'
import { getUsers } from '../services/tableService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function user() {
     const [rows, setRows] = useState([])
     const navigate = useNavigate()
 const getUserdata = async () => {
     const data = await getUsers()
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
     getUserdata()
   }, [])
 
   return (
     <div className="container py-4">
       <h3 className="mb-3">User Data</h3>
       <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/user/addUser')}
        >
          View User
        </button>
 
       {rows.length === 0 ? (
         <p>No data found.</p>
       ) : (
         <div className="table-responsive">
           <table className="table table-striped table-bordered">
             <thead className="table-dark">
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
