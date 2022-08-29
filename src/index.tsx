import { ChakraProvider, ColorModeScript, theme, createStandaloneToast } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "./App";

const { ToastContainer } = createStandaloneToast();

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <Router>
        <App />
        <ToastContainer />
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
