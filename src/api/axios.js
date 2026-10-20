import axios from 'axios';

// Base API URL pointing to the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let csrfTokenRequest;
const unsafeMethods = new Set(['post', 'put', 'patch', 'delete']);

apiClient.interceptors.request.use(async (config) => {
  if (!unsafeMethods.has((config.method || 'get').toLowerCase()) || config.url === '/csrf') return config;
  csrfTokenRequest ||= apiClient.get('/csrf').then(({ data }) => data.csrfToken).finally(() => { csrfTokenRequest = undefined; });
  config.headers['X-XSRF-TOKEN'] = await csrfTokenRequest;
  return config;
});

export default apiClient;
