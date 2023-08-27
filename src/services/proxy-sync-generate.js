import axios from "axios";
import {track} from "@/utils/track";
import {INSPIRE_ME} from "@/constants/mixpanel-events";

export const saveMessage = (params) => axios.post('/api/proxy/ai/v1/messages', params).then((resp) => {
  track(INSPIRE_ME, {
    msg_id: resp.id,
  });
  return resp;
});

export const getMessages = (params) => axios.get('/api/proxy/ai/v1/messages', { params });

export const postAutoFormat = (params) => axios.post(`/api/proxy/ai/v1/generate`, params);

export const generateTitle = (params) => axios.post(`/api/proxy/ai/v1/generate/title`, params);

// export const createRecord = (params) => axios.post(`/api/proxy/ai/v1/records`, params);

export const createRecordTemplate = (params) => axios.post(`/api/proxy/ai/v1/records/template`, params);

export const generateImage = (params) => axios.post('/api/proxy/ai/v1/image_gc/openai', params);

export const createRecord = (promptId, params) => axios.post(`/api/proxy/ai/v1/records/config/${promptId}`, params);

export const generateRecordText = (recordId) => axios.get(`/api/proxy/ai/v1/records/config/${recordId}`);