import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' in React 18
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter here
import "./i18n";
import { LoadingProvider } from "./context/LoadingContext";
import { Provider } from "react-redux";
import store from "./store";
// Create the root element and render your app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* Wrap the whole app in Router */}
      <AuthProvider>
        <ThemeProvider>
          <LoadingProvider>
          <Provider store={store}>
            <App />
            </Provider>,
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
