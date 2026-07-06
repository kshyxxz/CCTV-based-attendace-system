import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
