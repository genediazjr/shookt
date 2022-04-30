import React, { useContext, useEffect } from 'react';
import { Alert } from 'antd';
import { Context } from './Provider';

const Erratum = ({ className, noPad, style = {} }) => {
  const [state, dispatch] = useContext(Context);
  let error = '';
  if (state.error || state.good) {
    error = (
      <div style={style}>
        <Alert className={className} message={state.error || state.good} type={state.good ? 'success' : 'error'} />
        {noPad ? null : <br />}
      </div>
    );
  }

  useEffect(() => {
    return () => {
      dispatch({ delete: ['error', 'good'] });
    };
  }, []);

  return error;
};

Erratum.internal = 'The server encountered an unexpected error. Please contact support.';
Erratum.forgery = 'Your current page session has expired. Please refresh the page.';
Erratum.expired = 'Your code is either invalid or has already expired.';
Erratum.captcha = 'Please verify that you are not a robot.';

export default Erratum;
