import axios from "axios";

export const getCosAuth = (params) => axios.get('/api/common/sts').then(({ data }) => ({
  TmpSecretId: data.credentials.tmpSecretId,
  TmpSecretKey: data.credentials.tmpSecretKey,
  SecurityToken: data.credentials.sessionToken,
  // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
  StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
  ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
}));

