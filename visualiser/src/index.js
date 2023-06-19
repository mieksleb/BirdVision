import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


/** Connect to the root in the HTML */
const root = ReactDOM.createRoot(document.getElementById('root'));

/** Render Main into the root */
root.render(
  <App />
);