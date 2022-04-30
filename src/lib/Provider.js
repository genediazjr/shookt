import page from 'page';
import axios from 'axios';
import Utils from './Utils';
import Erratum from './Erratum';
import React, { createContext, useEffect, useReducer } from 'react';
axios.defaults.baseURL = process.env.REACT_APP_API_PREFIX;
const LOGINPATH = process.env.REACT_APP_LOGIN_PATH;

const states = {
  loading: false,
  content: '',
  routes: [],
  params: '',
  query: '',
  error: '',
  page: ''
};

const Reducer = (state, action) => {
  if (action.upsert || action.delete) {
    if (action.upsert) {
      for (const boxKey in action.upsert) {
        const boxVal = action.upsert[boxKey];
        if (Utils.keyCount(boxVal) > 0) {
          state[boxKey] = state[boxKey] || {};
          for (const valKey in boxVal) {
            state[boxKey][valKey] = boxVal[valKey];
          }
        } else {
          state[boxKey] = boxVal;
        }
      }
    }

    if (action.delete) {
      if (Array.isArray(action.delete)) {
        for (let i = 0; i < action.delete.length; ++i) {
          delete state[action.delete[i]];
        }
      } else {
        for (const boxKey in action.delete) {
          const boxVal = action.delete[boxKey];
          if (Array.isArray(boxVal)) {
            for (let i = 0; i < boxVal.length; ++i) {
              delete state[boxVal[i]];
            }
          } else if (Utils.keyCount(boxVal) > 0) {
            for (const valKey in boxVal) {
              delete state[boxKey][valKey];
            }
          } else {
            delete state[boxKey];
          }
        }
      }
    }

    return { ...state };
  }

  return state;
};

const Provider = (props = {}) => {
  const loadPage = page => {
    if (!page.code && !page.path) {
      throw new Error('missing page code or path');
    }
    if (!page.handler) {
      throw new Error('missing page handler');
    }
    states.routes = states.routes.concat(page);
  };
  if (Array.isArray(props.pages)) {
    props.pages.forEach(page => loadPage(page));
  } else {
    for (const key in props.pages) {
      loadPage(props.pages[key]);
    }
  }

  for (const key in props.state) {
    states[key] = props.state[key];
  }

  const [state, dispatch] = useReducer(Reducer, states);

  useEffect(() => {
    axios.interceptors.request.use(cfg => {
      dispatch({ upsert: { loading: true } });
      cfg.validateStatus = () => true;
      return cfg;
    }, err => {
      dispatch({
        upsert: {
          loading: false,
          error: 'Unable to connect to server. Please refresh the page.'
        }
      });
      return Promise.reject(err);
    });

    axios.interceptors.response.use(res => {
      dispatch({ upsert: { loading: false } });
      if (res.status === 401 &&
        res.data && res.data.message === 'Unauthorized' &&
        LOGINPATH && window.location.pathname !== LOGINPATH) {
        page.redirect(LOGINPATH);
        window.location.reload();
      } else if (res.status === 428) {
        dispatch({ upsert: { error: Erratum.captcha } });
      } else if (res.status >= 500) {
        dispatch({ upsert: { error: Erratum.internal } });
      } else if (res.data && (
        res.data.message === 'Invalid csrf token' ||
        res.data.message === 'Missing csrf secret'
      )) {
        dispatch({ upsert: { error: Erratum.forgery } });
      } else if (res.status >= 400) {
        dispatch({ upsert: { error: res.data.message } });
      }
      return res;
    }, err => {
      dispatch({ upsert: { loading: false } });
      return Promise.reject(err);
    });
  }, []);

  return (
    <Context.Provider value={[state, dispatch]}>
      {props.children}
    </Context.Provider>
  );
};

export const Context = createContext(states);
export default Provider;
