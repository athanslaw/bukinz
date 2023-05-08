import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import App from './App';
import { AuthController } from './contexts/AuthContext';
import { history } from './history';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <AuthController>
        <App />
      </AuthController>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
