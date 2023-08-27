import axios from "axios";

export const getAssets = (params) => axios.get('/api/assets', {params});

export const getAssetById = (id) => axios.get(`/api/assets/${id}`);

export const createAsset = (params) => axios.post('/api/assets', params);
