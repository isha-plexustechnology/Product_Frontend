import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        console.error('Bad Request:', error.response.data);
        break;

      case 401:
        console.error('Unauthorized – please login');
        break;

      case 403:
        console.error('Forbidden');
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
        console.error('Server error');
        break;

      default:
        console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;