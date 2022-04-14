import { ColorModeScript } from "@chakra-ui/react";
import ReactDOM, { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import React, { Component }  from 'react';
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import User from './components/User';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <Router>
    <Route path='/' element={<User/>} />
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
