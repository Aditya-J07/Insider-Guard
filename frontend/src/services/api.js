import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const threatService = {
  getLogs: () => api.get('/view-logs'),
  getAgentStatus: () => api.get('/agent-status'),
};