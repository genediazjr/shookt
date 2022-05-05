import { useRef, useEffect, useContext } from 'react';
import { Context } from './Provider';
import page from 'page';
import qs from 'qs';

export let NOTFOUNDCODE = process.env.REACT_APP_NOTFOUND_CODE;
export let TOOMANYCODE = process.env.REACT_APP_TOOMANY_CODE;
export let LOGINPATH = process.env.REACT_APP_LOGIN_PATH;
export let USERPATH = process.env.REACT_APP_USER_PATH;

const handlers = {};
const Router = props => {
  const isInitialMount = useRef(true);
  const [state, dispatch] = useContext(Context);

  if (props.notfound) {
    NOTFOUNDCODE = props.notfound;
  }
  if (props.toomany) {
    TOOMANYCODE = props.toomany;
  }
  if (props.loginpath) {
    LOGINPATH = props.loginpath;
  }
  if (props.userpath) {
    USERPATH = props.userpath;
  }

  useEffect(async () => {
    props.authenticate &&
      await props.authenticate(dispatch);

    state.routes.forEach(route => {
      if (route.path) {
        page(route.path, ctx => {
          if (props.onRoute &&
            props.onRoute({ state, dispatch, route, ctx })) {
            return;
          }

          const query = JSON.stringify(qs.parse(ctx.querystring));
          const params = JSON.stringify(ctx.params);
          const pagecall = JSON.stringify({ code: route.path, query, params });
          dispatch({ upsert: { query, params, pagecall, page: route.path } });
        });
      }

      handlers[route.path || route.code] = route.handler;
    });

    if (NOTFOUNDCODE) {
      page('*', () => {
        dispatch({
          upsert: {
            page: NOTFOUNDCODE,
            pagecall: JSON.stringify({
              code: NOTFOUNDCODE,
              query: {},
              params: {}
            })
          }
        });
      });
    }
    page();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (handlers[state.page]) {
        let params = {};
        let query = {};
        if (state.params) {
          try {
            params = JSON.parse(state.params);
          } catch (err) {
            console.error('Unable to parse params.', err);
          }
        }
        if (state.query) {
          try {
            query = JSON.parse(state.query);
          } catch (err) {
            console.error('Unable to parse query.', err);
          }
        }
        dispatch({ upsert: { content: handlers[state.page]({ params, query }) || '' } });
        window.scrollTo(0, 0);
      }
      dispatch({ delete: ['error'] });
    }
  }, [state.pagecall]);

  useEffect(() => {
    if (state.accessdenied) {
      dispatch({ upsert: { content: state.accessdenied } });
      dispatch({ delete: ['accessdenied'] });
      window.scrollTo(0, 0);
    }
  }, [state.accessdenied]);

  return props.children;
};

export default Router;
