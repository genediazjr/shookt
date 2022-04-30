import Projector from './Projector';
import Provider from './Provider';
import Router from './Router';
import React from 'react';

const Shookt = props => {
  return (
    <Provider {...props}>
      <Router {...props}>
        <Projector />
      </Router>
    </Provider>
  );
};

export default Shookt;
