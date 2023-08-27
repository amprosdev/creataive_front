import axios from "axios";

export const initOrganization = (params) => axios.post('/api/organizations',  params);

export const getOrganizationById = (id) => axios.get(`/api/organizations/${id}`);
