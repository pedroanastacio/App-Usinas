import axios from "axios"; 
import { getToken, removeToken  } from "./AuthStorage";
import router from '../router';

const api = axios.create({
  baseURL: "https://watermeter-unipam.herokuapp.com/"
  //baseURL: "http://127.0.0.1:3333"
});

api.interceptors.request.use(async config => {
  const userToken = getToken();
   
  if (userToken) {
    const token = userToken
    config.headers.Authorization = `Bearer ${token}`;
  }
  /*else{
    config.headers.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU4ODU0MzI1M30.-z_HxHIJUvCRZ1JrtIFYe35pRt7776-DEWYLcmF4f5s";
  }*/
  return config;
});

api.interceptors.response.use(response => {
  return response
}, async error => {
  const hasDataError = await Object.prototype.hasOwnProperty.call(error.response.data, "name")
 
  if(hasDataError){
    console.log(error.response.data)
    if (error.response.data.name == 'ExpiredJwtToken'){
      removeToken();
      router.push('/login');
    }
  }
  
  return Promise.reject(error)  
  })

export default api;