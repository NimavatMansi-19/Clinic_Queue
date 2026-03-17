import {api} from "./api";

export async function getQueue(){
  const endpoints = ['/queue', '/queue/today']
  let lastError
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint)
      return response.data
    } catch (err) {
      lastError = err
      if (![400, 404].includes(err?.response?.status)) {
        throw err
      }
    }
  }
  throw lastError
}

export async function updateQueue(id, data){
  const safeId = /^\d+$/.test(String(id)) ? Number(id) : id
  const payload = { status: data?.status }
  const response = await api.patch(`/queue/${safeId}`, payload)
  return response.data
}