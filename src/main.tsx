import "@/styles/styles.css";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";

import theme from "@/styles/theme";

import App from "./App";
import { InesProvider } from "./contexts/ines";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <InesProvider>
        <App />
      </InesProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
