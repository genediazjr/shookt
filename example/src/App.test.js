import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';

it('renders without crashing', () => {
  const root = createRoot(document.createElement('div'));
  root.render(<App />);
  root.unmount();
});
