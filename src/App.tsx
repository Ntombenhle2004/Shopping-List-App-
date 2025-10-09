import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/protectRoute";
import "./App.css";
import PrivacySecurity from "./pages/privacy";
import Landing from "./pages/landing";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<PrivacySecurity />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
