import 'antd/dist/antd.css';
import './App.css';
import React, { useContext } from 'react';
import { Shookt, Mobile, Code6, Context, Captcha, Erratum } from 'shookt';

const Test = props => {
  const [state, dispatch] = useContext(Context);

  return (
    <>
      <p><a href='/'>Home</a></p>
      <p><a href='/test?a=1'>Test</a></p>
      <p>Mobile: {state.mobile}</p>
      <p>TestVal: <input type='text' onChange={e => dispatch({ upsert: { testVal: e.target.value } })} /></p>
      <p>TestVal: {state.testVal}</p>
      <p>Error: <input type='text' onChange={e => dispatch({ upsert: { error: e.target.value } })} /></p>
      <Erratum />
      <Code6 format='###' placeholder='---' />
    </>
  );
};

const Home = props => {
  const [state, dispatch] = useContext(Context);

  return (
    <>
      <Mobile
        country='ph'
        placeholder='mobile'
        value={state.mobile}
        onChange={val => dispatch({ upsert: { mobile: val } })}
      />
      <p>Site Key: <input type='text' onChange={e => dispatch({ upsert: { siteKey: e.target.value } })} /></p>
      <Captcha sitekey={state.siteKey} />
      <p>Home</p>
      <p><a href='/test'>Test</a></p>
    </>
  );
};

const pages = [
  {
    path: '/',
    code: 'home',
    handler: props => <Home {...props} />
  },
  {
    path: '/test',
    code: 'test',
    handler: props => <Test {...props} />
  },
  {
    code: 'notFound',
    handler: props => <>Not Found</>
  }
];

const App = () => <Shookt pages={pages} notfound='notFound' />;

export default App;
