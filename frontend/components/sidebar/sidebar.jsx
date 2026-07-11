import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Camera,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Live Attendance", icon: Camera, path: "/live-attendance" },
    { name: "Attendance", icon: FileText, path: "/attendance" },
  ];

  return (
    <aside className={`sidebar-drawer ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShieldCheck size={24} />
        </div>
        {!isCollapsed && (
          <div className="sidebar-brand">
            <h1>Attendance System</h1>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : "inactive"}`
              }
            >
              <div className="sidebar-icon">
                <Icon size={20} strokeWidth={2} />
              </div>

              {!isCollapsed && (
                <span className="sidebar-label">{item.name}</span>
              )}

              {isCollapsed && (
                <div className="sidebar-tooltip">{item.name}</div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="sidebar-toggle"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
