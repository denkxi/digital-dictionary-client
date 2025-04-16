import axios from 'axios';
import { store } from '../../app/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // TODO: Use url from env
  withCredentials: true // optional
});

axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default axiosInstance;
