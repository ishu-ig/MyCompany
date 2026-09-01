import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/",            icon: "bi-speedometer2",          label: "Dashboard"        },
  { to: "/user",        icon: "bi-people-fill",           label: "Users (6 Roles)"  },
  { to: "/job",         icon: "bi-briefcase-fill",        label: "Job Vacancies"    },
  { to: "/course",      icon: "bi-mortarboard-fill",      label: "Training Courses" },
  { to: "/application", icon: "bi-file-earmark-text-fill", label: "Applications"     },
  { to: "/interview",   icon: "bi-camera-video-fill",     label: "Interviews"       },
  { to: "/placement",   icon: "bi-trophy-fill",           label: "Placements & CTC" },
  { to: "/certificate", icon: "bi-patch-check-fill",      label: "Certificates"     },
  { to: "/blog",        icon: "bi-journal-richtext",      label: "Career Blogs"     },
  { to: "/contactUs",   icon: "bi-chat-left-dots-fill",   label: "Enquiries & Leads"},
];

export default function Sidebar({ onLinkClick }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name || localStorage.getItem("name") || "Super Admin";

  return (
    <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
      <div className="sidebar-header">
        <NavLink className="brand-mark" to="/" aria-label="Dashboard">
          <span className="brand-icon">
            <i className="bi bi-briefcase-fill text-indigo-600" aria-hidden="true"></i>
          </span>
          <span className="brand-copy">
            <span className="brand-title">TalentNestro</span>
            <span className="brand-subtitle">Staffing Command Console</span>
          </span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={() => {
              if (!window.matchMedia("(min-width: 992px)").matches) {
                onLinkClick?.();
              }
            }}
          >
            <span className="nav-icon">
              <i className={`bi ${icon}`} aria-hidden="true"></i>
            </span>
            <span className="nav-text">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <img
          className="avatar-img avatar-md sidebar-user-avatar"
          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250"}
          alt={name}
        />
        <strong>{name}</strong>
        <small>Super Administrator</small>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">TalentNestro Live (Port 5001)</span>
      </div>
    </aside>
  );
}