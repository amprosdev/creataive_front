import axios from "axios";

export const getUserInfo = () => axios.get(`/api/mine`);

export const updateUserInfo = (params) => axios.put(`/api/mine`, params);

export const postFeedbacks = (params) => axios.post(`/api/feedbacks`, params);
export const updateOrganizationsInfo = (params) => axios.put(`/api/organizations/${params.id}`, params.data);
export const getOrganizationsInfo = (id) => axios.get(`/api/organizations/${id}`);
export const updateOrganizationsUser = (params) => axios.put(`/api/organization-users/${params.id}`, params);
export const createTrialAccount = () => axios.get(`/api/wx-base/create-trial-account`);
export const sendSmsCode = (params) => axios.post(`/api/wx-base/send-sms-code`, params);
export const bindPhone = (params) => axios.post(`/api/wx-base/bind-phone`, params);
export const login  = (params) => axios.post(`/api/login`, params);

