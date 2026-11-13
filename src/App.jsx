import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Register from "./pages/Register";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/workspace" element={<Workspace />} />
    </Routes>
  );
}
