import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css"

const CLIENT_ID = "834528588081-k09htjt9acfhah2vaf3uc56uro2fml3s.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
