import axios from 'axios';
const csrfName = process.env.REACT_APP_CSRF_NAME;
const headerKey = `X-${csrfName}`;
const getCsrf = headers => {
  const head =
    headers[headerKey] ||
    headers[headerKey.toLowerCase()];
  if (head) {
    csrf = head;
  }
};
let csrf = '';

export const intercept = () => {
  axios.interceptors.request.use(cfg => {
    const captcha = sessionStorage.getItem('xcp');
    const headers = { ...cfg.headers };
    if (captcha) {
      headers['X-Captcha'] = captcha;
      sessionStorage.removeItem('xcp');
    }
    headers[headerKey] = csrf;
    cfg.headers = headers;
    return cfg;
  }, err => Promise.reject(err));
  axios.interceptors.response.use(res => {
    getCsrf(res.headers);
    if (window.grecaptcha) {
      try {
        grecaptcha.reset();
      } catch (ex) {
      }
    }
    return res;
  }, err => {
    getCsrf(err.response.headers);
    return Promise.reject(err);
  });
};
