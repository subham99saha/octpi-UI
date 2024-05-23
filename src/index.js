import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/home';
import SubUser from './modules/subUser';
import Payments from './modules/payments';
import config from "./config.json"

// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <Router>
    <Routes>
      <Route path={`/`} element={<Home/>} />
      <Route path={`/${config.ENDPOINT.SUBUSER}/:clientId/:username`} element={<SubUser/>} />
      <Route path={`/${config.ENDPOINT.PAYMENT}/:clientId`} element={<Payments/>} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

