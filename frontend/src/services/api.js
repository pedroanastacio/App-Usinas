import axios from "axios"; 
import { getToken, removeToken } from "./AuthStorage";
import router from '../router';

const api = axios.create({
  baseURL: "http://127.0.0.1:3333"
});

api.interceptors.request.use(async config => {
  const user = getToken();
  if (user) {
    const token = JSON.parse(user).token
    config.headers.Authorization = `Bearer ${token}`;
  }
  /*else{
    config.headers.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU4ODU0MzI1M30.-z_HxHIJUvCRZ1JrtIFYe35pRt7776-DEWYLcmF4f5s";
  }*/
  return config;
});

api.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.data.error.name == 'ExpiredJwtToken'){
    removeToken();
    router.push('/login');
  }
})

export default api;