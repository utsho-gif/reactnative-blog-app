import axios from 'axios';
import Constants from 'expo-constants';

const baseURL =
  Constants.expoConfig?.extra?.apiBaseURL || 'https://blogginapptest.ddns.net/';

console.log('Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (request) => {
    console.log('Starting Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      baseURL: request.baseURL,
    });
    return request;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.log('No Response Error:', error.request);
    } else {
      console.log('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
