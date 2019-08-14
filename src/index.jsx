import ReactDOM from 'react-dom';
import React from 'react';
import App from './App.jsx';
import reloadMagic from './reload-magic-client.js'; // automatic reload
import { Provider } from 'react-redux';
import store from './store.js';

reloadMagic(); // automatic reload

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
