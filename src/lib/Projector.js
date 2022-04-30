import { Context } from './Provider';
import { useContext } from 'react';

const Projector = () => {
  const [state] = useContext(Context);
  return state.content;
};

export default Projector;
