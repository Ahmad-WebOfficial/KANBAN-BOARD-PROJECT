import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Login from "./Pages/Login"; 
import SignUp from "./Pages/Signup";

import Private from "./components/Private";        
import Dashboard from "./components/Dashboard";  

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Private component={Dashboard} />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);




