import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Global styles must load before the component tree so per-component
// stylesheets can override the shared primitives.
import "@fontsource-variable/inter";
import "./index.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
