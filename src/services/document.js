import axios from "axios";
import {track} from "@/utils/track";
import {CREATE_DOCUMENT} from "@/constants/mixpanel-events";

export const updateArticle = (params) => axios.put(`/api/articles/${params.id}`, params);
export const createConversations = (params) => axios.post('/api/proxy/ai/v1/conversations', params);

export const saveArticle = (params) => axios.post('/api/articles', params).then((resp) => {
  track(CREATE_DOCUMENT, {
    doc_id: resp.data.id,
  });
  return resp;
})

export const getArticleById = (id) => axios.get(`/api/articles/${id}`);

export const getDocuments = (params) => axios.get('/api/articles', {params});

export const deleteDocumentById = (id) => axios.delete(`/api/articles/${id}`);

