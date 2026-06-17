import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
axios.defaults.withCredentials = true;

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
