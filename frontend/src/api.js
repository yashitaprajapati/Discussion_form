import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // <-- Backend port and /api prefix
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // <-- Fixed backticks
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};