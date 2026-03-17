import {api} from "./api";
export async function bookApp(data){
    const response = await api.post('/appointments',data)
    return response.data;
}
export async function getMyAppointments(){
  const response = await api.get('/appointments/my')
  return response.data;
}
export async function getByID(id){
    const response = await api.get(`/appointments/${id}`)
    return response.data;
}