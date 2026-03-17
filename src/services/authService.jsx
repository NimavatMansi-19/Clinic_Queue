import { api }  from "./api";
export const login=async(data)=>{
    const response=await api.post("/auth/login",data);
    if(!response.data.error){
        const token = response.data.token;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decoded));
    } 
    return response.data;
}
export const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
export const getCurrentUser=()=>{
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}
export const getToken =()=>{
    return localStorage.getItem("token");
}