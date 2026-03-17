import {api} from "./api";
export async function getalldoctor(){
  const response = await api.get('/doctor/queue')
  return response.data;
}

// prescriptions
export async function getMyPrescriptions(){
  try {
    const response = await api.get('/prescriptions/my')
    return response.data
  } catch (err) {
    // Some backend builds expose this route with a legacy typo.
    if (err?.response?.status === 404) {
      const fallback = await api.get('/prescrition/my')
      return fallback.data
    }
    throw err
  }
}

// Backward-compatible alias for existing imports.
export const getUsers = getMyPrescriptions

export async function postprescriptionByID(id, data){
  const safeId = /^\d+$/.test(String(id)) ? Number(id) : id
  const endpoints = [
    `/prescriptions/${safeId}`,
    `/prescrition/${safeId}`,
    `/prescription/${safeId}`
  ]
  const payloads = [
    data,
    { prescription: data },
    { medicines: data?.medicines ?? [], notes: data?.notes ?? '' }
  ]

  let lastError
  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        const response = await api.post(endpoint, payload)
        return response.data
      } catch (err) {
        lastError = err
        // Try alternate combinations for common contract mismatches.
        if (![400, 404, 422].includes(err?.response?.status)) {
          throw err
        }
      }
    }
  }

  throw lastError
}

//reports
export async function getReports(){
    const response = await api.get('/reports/my')
    return response.data;
}

export async function postReportByID(id, data){
  const safeId = /^\d+$/.test(String(id)) ? Number(id) : id
  const endpoints = [
    `/reports/${safeId}`,
    `/report/${safeId}`
  ]
  const payloads = [
    data,
    { report: data }
  ]

  let lastError
  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        const response = await api.post(endpoint, payload)
        return response.data
      } catch (err) {
        lastError = err
        if (![400, 404, 422].includes(err?.response?.status)) {
          throw err
        }
      }
    }
  }

  throw lastError
}