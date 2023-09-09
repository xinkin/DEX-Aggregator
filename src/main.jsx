import * as React from "react";
import App from "./App.jsx";
import * as ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
