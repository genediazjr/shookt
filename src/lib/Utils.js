import React from 'react';
import dayjs from 'dayjs';
import qs from 'qs';
import { Empty, Menu } from 'antd';

const Utils = {};

Utils.ellipsis = {
  rows: 1,
  symbol: 'more',
  expandable: true
};

Utils.qs = obj => {
  if (!obj) {
    return '';
  }
  return qs.stringify(obj);
};

Utils.sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

Utils.clearError = dispatch => () => {
  dispatch({ delete: ['error'] });
};

Utils.checkBox = (_, value) => value
  ? Promise.resolve()
  : Promise.reject(new Error());

Utils.keyCount = value => {
  if (value && Utils.isObject(value)) {
    return Object.keys(value).length;
  }
  return 0;
};

Utils.isJSONObj = obj => {
  return obj !== null &&
    typeof obj === 'object' &&
    !(obj instanceof Date);
};

Utils.isJSONStr = str => {
  try {
    if (isNaN(str)) {
      JSON.parse(str);
      return true;
    }
  } catch (ex) {
  }
  return false;
};

Utils.cleanQuery = (query, sortOpts) => {
  if (query.sort && Array.isArray(query.sort) && query.sort.length &&
    !(sortOpts.filter(o => {
      let val = o.value;
      if (typeof o.value === 'object') {
        val = JSON.stringify(o.value);
      }
      return val === JSON.stringify(query.sort[0]);
    })).length) {
    query.sort = [];
  }
  if (query.page && (isNaN(query.page) || parseInt(query.page) < 1)) {
    query.page = 1;
  }
  if (query.category && (isNaN(query.category) || parseInt(query.category) < 1000)) {
    delete query.category;
  }
  return query;
};

Utils.toOrdinal = num => {
  if (!num) {
    return '';
  }
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
};

Utils.toMonetary = (num, precision) => {
  if (!num) {
    return 0;
  }
  let digits = precision;
  if (precision === null || isNaN(precision)) {
    digits = 2;
  }
  return parseFloat(num).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
};

Utils.padString = (pad, size, str, isRight) => {
  let res = str || '';
  res = res.toString();
  while (res.length < size) {
    if (isRight) {
      res = `${res}${pad}`;
    } else {
      res = `${pad}${res}`;
    }
  }
  return res;
};

Utils.strToHex = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

Utils.rand = () => {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0];
};

Utils.isUsable = value => {
  if (typeof value !== 'undefined' &&
    value !== null &&
    value !== '') {
    return true;
  }

  return false;
};

Utils.isObject = value => {
  if (typeof value === 'object' &&
    !Array.isArray(value)) {
    return true;
  }

  return false;
};

Utils.isRoman = str => {
  if (['ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'].includes(str.toLowerCase())) {
    return str.toUpperCase();
  }
  return false;
};

Utils.noRecords = desc => ({
  emptyText: (
    <Empty
      description={desc || 'No records found'}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  )
});

Utils.getAge = (dob, returnObject) => {
  let years = 0;
  let days = dayjs().diff(dob, 'days');
  if (days >= 365) {
    years = Math.floor(days / 365);
    days -= years * 365;
  }
  if (returnObject) {
    return { years, days };
  }
  return `${years}Y ${days}D`;
};

Utils.listMatches = (strArray, find) => {
  const matches = [];
  strArray.forEach((str) => {
    if (str.toLowerCase().includes(find.toLowerCase())) {
      matches.push(str);
    }
  });
  return matches;
};

Utils.mustMatch = (pairName, message) => {
  return ({ getFieldValue }) => ({
    validator (_, value) {
      if (!value || getFieldValue(pairName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(message));
    }
  });
};

Utils.passwordPolicy = policy => {
  return () => ({
    validator (_, value) {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNonalphas = /\W/.test(value);
      const hasNumbers = /\d/.test(value);
      if (value) {
        if (policy.hasUpperCase && !hasUpperCase) {
          return Promise.reject(new Error('Password must contain at least one uppercase letter'));
        }
        if (policy.hasLowerCase && !hasLowerCase) {
          return Promise.reject(new Error('Password must contain at least one lowercase letter'));
        }
        if (policy.hasNonalphas && !hasNonalphas) {
          return Promise.reject(new Error('Password must contain at least one non-alphanumeric character'));
        }
        if (policy.hasNumbers && !hasNumbers) {
          return Promise.reject(new Error('Password must contain at least one number'));
        }
        if (policy.minLength && value.length < policy.minLength) {
          return Promise.reject(new Error(`Password must be at least ${policy.minLength} characters long`));
        }
      }
      return Promise.resolve();
    }
  });
};

Utils.makeOptions = strArray => {
  const options = [];
  strArray.forEach(txt => {
    options.push({ label: txt, value: txt });
  });
  return options;
};

Utils.makeMenu = items => {
  const newMenu = [];
  const makeItem = i => {
    let label = i.label;
    if (i.path) {
      label = <a href={i.path}>{i.label}</a>;
    }
    const props = {
      key: i.path || i.code || i.label,
      icon: i.icon,
      style: i.style,
      className: i.className
    };
    return <Menu.Item {...props}>{label}</Menu.Item>;
  };
  items.forEach(i => {
    const subMenu = [];
    if (Array.isArray(i.submenu)) {
      i.submenu.forEach(s => {
        subMenu.push(makeItem(s));
      });
      newMenu.push(
        <Menu.SubMenu
          key={i.path || i.code || i.label}
          icon={i.icon}
          title={i.label}
          style={i.style}
          className={i.className}
        >
          {subMenu}
        </Menu.SubMenu>
      );
    } else {
      newMenu.push(makeItem(i));
    }
  });
  // TODO: reusable onClick handler for both path and code

  return newMenu;
};

Utils.getOpenMenu = (menuItems, page) => {
  for (const key in menuItems) {
    if (Object.keys(menuItems[key]).includes(page)) {
      return key;
    }
  }
};

Utils.toCapitalize = str => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
};

Utils.toTitleCase = str => {
  if (!str) {
    return '';
  }
  return str.replace(/\w\S*/g, txt => {
    return Utils.isRoman(txt) || Utils.toCapitalize(txt);
  });
};

Utils.formatName = (obj, short) => {
  if (!obj) {
    return '';
  }
  return Utils.toTitleCase(
    `${obj.last_name || ''}${(obj.last_name) ? ',' : ''} ${obj.first_name || ''} ${short ? (obj.middle_name ? obj.middle_name[0] : '') : obj.middle_name || ''}`
  ).trim();
};

Utils.fileBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};

Utils.readFile = (callback) => {
  return file => {
    Utils.fileBase64(file, callback);
    return false;
  };
};

Utils.checkFile = (dispatch, opts) => {
  return file => {
    dispatch({ delete: ['error'] });
    let isTypeOk = true;
    let isSizeOk = true;
    if (opts.types) {
      isTypeOk = false;
      opts.types.forEach(type => {
        if (file.type.toLowerCase() === type.toLowerCase()) {
          isTypeOk = true;
        }
      });
      if (!isTypeOk) {
        dispatch({ upsert: { error: `File type ${file.type.replace('image/', '')} is not allowed` } });
      }
    }
    if (opts.size) {
      isSizeOk = file.size / 1024 / 1024 < opts.size;
      if (!isSizeOk) {
        dispatch({ upsert: { error: `File must be smaller than ${opts.size}MB` } });
      }
    }
    return isTypeOk && isSizeOk;
  };
};

export default Utils;
