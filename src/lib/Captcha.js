import React, { Fragment, useContext, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Context } from './Provider';
import './Captcha.css';

const CAPTCHAKEY = process.env.REACT_APP_RECAPTCHA_KEY;

const Captcha = props => {
  const [, dispatch] = useContext(Context);
  const siteKey = props.sitekey || CAPTCHAKEY;
  const setCaptcha = (captcha) => {
    dispatch({ delete: ['error'] });
    dispatch({ upsert: { captcha } });
    sessionStorage.setItem('xcp', captcha);
    if (props.onChange) {
      props.onChange(captcha);
    }
  };

  useEffect(() => {
    return () => {
      dispatch({ delete: ['captcha'] });
      if (window.grecaptcha) {
        try {
          grecaptcha.reset();
        } catch (ex) {
        }
      }
    };
  }, []);

  if (!siteKey) {
    return <>No Site key for reCaptcha</>;
  }

  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={setCaptcha}
      className={props.className || 'shookt-captcha'}
      style={props.style}
    />
  );
};

export default Captcha;
