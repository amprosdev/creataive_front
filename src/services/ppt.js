import axios from 'axios';

export const createPPT = (params) => axios.post('/api/ppts', params);

export const getPPTById = (id) => axios.get(`/api/ppts/${id}`);

export const updatePPTById = (params) => axios.put(`/api/ppts/${params.id}`, params);

export const deletePPTById = (id) => axios.delete(`/api/ppts/${id}`);

export const getPPTList = (params) => axios.get(`/api/ppts`, {params});

export const getTemplateList = (params) => axios.get(`/api/ppt-templates`, {params});

export const getTemplateById = (id) => axios.get(`/api/ppt-templates/${id}`);

export const getGraphicList = (params) => axios.get(`/api/ppt-graphics`, {params});

export const createPPTByChosen = (params) => axios.post(`/api/ppt-chosen`, params);

export const getChosenList = (params) => axios.get(`/api/ppt-chosen`, {params});
