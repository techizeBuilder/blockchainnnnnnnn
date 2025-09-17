
import EnvVars from "@/config/EnvVariables";
import axios from "axios";
const Request = axios.create({
  baseURL: EnvVars.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


Request.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem("token")
    
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

export default Request;