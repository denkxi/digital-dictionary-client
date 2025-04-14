import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // TODO: Use url from env
  withCredentials: true // optional
});

export default axiosInstance;
