import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

import '@atlaskit/css-reset';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap the App in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
