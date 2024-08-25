import React from 'react';
// eslint-disable-next-line import/order
import ReactDOM from 'react-dom/client';

import './index.scss';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
