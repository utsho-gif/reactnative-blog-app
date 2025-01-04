import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.232.123.216/',
});

export default api;
