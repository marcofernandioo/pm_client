import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Routes from './components/Router'
import Pricelist from './components/Pricelist'

ReactDOM.render(
  <React.StrictMode>
    {/* <Routes /> */}
    {/* <App /> */}
    <Pricelist />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

