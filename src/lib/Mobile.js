import React, { Fragment, useState, useContext } from 'react';
import { Context } from './Provider';
import { PhoneNumberUtil } from 'google-libphonenumber';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './Mobile.css';

const mask = parseInt(process.env.REACT_APP_MASK_MOBILE || 0);
const phoneUtil = PhoneNumberUtil.getInstance();
const isValid = (phone, countryCode) => {
  if (!phone) {
    return true;
  }
  try {
    const parsed = phoneUtil.parse(phone, countryCode);
    return (
      phoneUtil.isPossibleNumber(parsed) &&
      phoneUtil.isValidNumber(parsed) &&
      phoneUtil.isValidNumberForRegion(parsed, countryCode)
    );
  } catch (ex) {
    return false;
  }
};

const Phone = props => {
  const [, dispatch] = useContext(Context);
  const [valid, setValid] = useState(true);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [ext, setExt] = useState('');

  const onChange = (value, country, e, formattedValue) => {
    formattedValue = formattedValue.replace(/\s/g, '');
    setPhone(formattedValue);
    setCountryCode(country.countryCode);
    if (isValid(formattedValue, country.countryCode)) {
      setValid(true);
      dispatch({ delete: ['error'] });
      props.onPhone && props.onPhone(`${formattedValue}${(ext) ? `#${ext}` : ''}`);
    }
    if (props.onChange) {
      props.onChange(value, country, e, formattedValue);
    }
  };

  const extChange = e => {
    if (!e.target.value) {
      return;
    }
    const extn = e.target.value.replace(/#/g, '');
    setExt(extn);
    dispatch({ delete: ['error'] });
    props.onPhone && props.onPhone(`${phone}${(extn) ? `#${extn}` : ''}`);
  };

  const onBlur = () => {
    setValid(isValid(phone, countryCode));
  };

  return (
    <>
      <PhoneInput
        value={props.value}
        country={props.country}
        preferredCountries={[props.country]}
        countryCodeEditable={false}
        placeholder={props.placeholder}
        onChange={onChange}
        onBlur={onBlur}
        isValid={valid}
        inputProps={props.noAutoFocus ? {} : { autoFocus: true }}
        inputClass={props.inputClass || 'shookt-mobile-input'}
        buttonClass={props.buttonClass || 'shookt-mobile-flag'}
        dropdownClass={props.dropdownClass || 'shookt-mobile-dropdown'}
      />
      {
        mask
          ? <input type='text' onChange={extChange} value={props.testValue} className={props.testClass || 'shookt-mobile-test'} />
          : <></>
      }
    </>
  );
};

export default Phone;
