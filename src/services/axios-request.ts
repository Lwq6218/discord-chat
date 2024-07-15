import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_DISCORD_CHAT_URL;
axios.defaults.timeout = 10000;
//withCredentials 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('accessToken');
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    if (typeof res.data !== 'object') {
      console.log('服务端异常！');
      return Promise.reject(res);
    }
    if (res.data.code != '00000') {
      if (res.data.message) {
        console.log('服务端异常！');
      }
      // 登录已过期
      if (res.data.code == 'A0230') {
        console.log('登录过期！');
        // 移除 token
        localStorage.removeItem('accessToken');
      }

      return Promise.reject(res.data);
    }
    return res.data;
  },
  (error) => {
    console.log('服务端异常！');
    console.log(error);
    Promise.reject(error);
  }
);

export default axios;
