import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Camera,
  FileText,
  Calendar, // Added for Timetable
  BookOpen, // Added for Subjects
  GraduationCap, // Added for Classes
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Live Attendance", icon: Camera, path: "/recognition" },
    { name: "Attendance", icon: FileText, path: "/attendance" },
    { name: "Timetable", icon: Calendar, path: "/timetable" },
    { name: "Subjects", icon: BookOpen, path: "/subjects" },
    { name: "Classes", icon: GraduationCap, path: "/classes" },
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

        {/* Logout Section */}
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `sidebar-link logout-link ${isActive ? "active" : "inactive"}`
          }
        >
          <div className="sidebar-icon">
            <LogOut size={20} strokeWidth={2} />
          </div>

          {!isCollapsed && <span className="sidebar-label">Logout</span>}

          {isCollapsed && <div className="sidebar-tooltip">Logout</div>}
        </NavLink>
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
