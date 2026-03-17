import {api} from "./api";
export async function getClinic(){
  const response = await api.get('/admin/clinic')
  return response.data;
}
export async function getUsers(){
  const response = await api.get('/admin/users')
  return response.data;
}
export async function insertUsers(data){
    const response = await api.post('/admin/users',data)
    return response.data;
}