import axios from 'axios';
import store from 'store';
import {useEffect} from 'react';
import {message} from 'antd';


// todo 上线前生产环境需要设置 baseURL
axios.defaults.baseURL = 'https://api.creataive.net';
// axios.defaults.baseURL = '';

let showBindPhone = true;
const showBindPhoneFn = () => {
  if (!showBindPhone) {
    setTimeout(() => {
      showBindPhone = true;
    }, 30000)
  }
}
axios.interceptors.request.use(function (config) {
  let token = store.get('_authing_token');
  let organizationId = store.get('organization');
  if (token) {
    config.headers = {
      Authorization: `${token}`,
      Organization: organizationId
    }
  }
  console.log(process.env.NODE_ENV);
  // 本地调试使用
  // config.url = config.url.replace('/api', '');
  return config;
}, err => Promise.reject(err));

let onlogin = false;
export const useResponseInterceptor = (event) => {
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      ({data}) => {
        message.config({
          maxCount: 1,
        });
        if (data.status === 401) {
          if (onlogin) {
            return;
          }
          onlogin = true;
          event.emit({
            type: 'show-login',
          });
        }
        switch (data.code) {
          case 10:
            message.open({
              type: 'warning',
              content: '数量已达当前版本上线。',
            });
            event.emit({
              type: 'modal-contact-us',
              val: 2,
            });
            break;
          case 1:
            message.open({
              type: 'error',
              content: data.data,
            });
            break;
          case 20:
            // todo 上线前放开手机号绑定注释
            if (showBindPhone) {
              showBindPhone = false;
              showBindPhoneFn();
              event.emit({
                type: 'modal-bind-phone',
                val: 2,
              });
            }
            data.code = 0;
            break;
          case 0:
            break;
          default:
            console.log('未知code')
            break;
        }
        return data;
      },  // 拦截到响应对象，将响应对象的 data 属性返回给调用的地方
      err => Promise.reject(err)
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
}
