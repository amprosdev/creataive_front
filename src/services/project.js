import axios from "axios";

export const getProjectById = (id) => axios.get(`/api/projects/${id}`);

export const saveProject = (params) => axios.post('/api/projects', params);

export const getProject = (params) => axios.get('/api/projects', { params });

export const deleteProject = (id) => axios.delete(`/api/projects/${id}`);
