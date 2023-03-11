import { Context } from './Provider';
import { useContext, useEffect } from 'react';
import { Grid } from 'antd';

const Projector = () => {
  const [state, dispatch] = useContext(Context);
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    if (Object.keys(screens).length) {
      dispatch({ upsert: { screens } });
    }
  }, [screens]);

  return state.content;
};

export default Projector;
