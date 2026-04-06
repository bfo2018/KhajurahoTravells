import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CookieConsentProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CookieConsentProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
