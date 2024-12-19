import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend URL
  withCredentials: true, // Required for cookies
});

export default instance;
