import axios from 'axios';

export const getUserHistories = (params) => axios.post('/history', params);

