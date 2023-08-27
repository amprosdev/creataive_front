import axios from 'axios';

export const getPictures = (params) => axios.get('/api/pictures', { params });

export const getEditorPick = (params) => axios.get('/api/pictures/editor-pick', { params });

export const postPicture = (params) => axios.post('/api/pictures',  params);

export const updatePicture = (params) => axios.put(`/api/pictures/${params.id}`, params);

export const deletePicture = (id) => axios.delete(`/api/pictures/${id}`);

