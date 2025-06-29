import axios from 'axios';

const API_BASE_URL = 'https://closet-recruiting-api.azurewebsites.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchContentsAPI = async () => {
  const response = await api.get('/data');
  return response.data;
};

export default api;
