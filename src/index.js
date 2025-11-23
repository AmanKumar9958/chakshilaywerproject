import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // optional if you want global styles
import ChakshiDashboard from "./components/ChakshiDashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ChakshiDashboard/> */}
    <App />
  </React.StrictMode>
);
