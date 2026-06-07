import axios from 'axios';
import { auth } from './firebase';

const api = axios.create();

api.interceptors.request.use(async (config) => {
  await auth.authStateReady();
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
