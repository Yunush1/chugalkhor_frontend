import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./services/store/ThemeContex.jsx";
import { SocketProvider } from "./services/socket/SocketProvider.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './services/store/queryClient.js'
createRoot(document.getElementById("root")).render(
  <ConfigProvider >
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SocketProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  </ConfigProvider>
);