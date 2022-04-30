import React from 'react';
import NumberFormat from 'react-number-format';
import './Code6.css';

const Code6 = props => {
  return (
    <div className='shookt-code-6-box'>
      <NumberFormat {...{
        ...{
          mask: '-',
          format: '######',
          placeholder: '------',
          className: `ant-input shookt-code-6 ${props.centered ? 'shookt-code-6-center' : ''}`
        },
        ...props
      }}
      />
    </div>
  );
};

export default Code6;
