// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiSettings, FiUser, FiUsers, FiLogOut } from "react-icons/fi"; // Import FiLogOut icon
import "../css/Sidebar.css";
import logo from "../images/LOGO-ONDEFOC_BLAN.png";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role) {
            setUserRole(user.role);
        }
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="toggle-icon" onClick={toggleSidebar}>
                <FiMenu />
            </div>

            {/* Logo section, displayed only when the sidebar is open */}
            {isOpen && (
                <div className="sidebar-logo">
                    <img src={logo} alt="Company Logo" />
                </div>
            )}

            <nav>
                {/* Dashboard Link */}
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    <FiHome />
                    {isOpen && <span> Dashboard</span>}
                </Link>

                {/* Settings Link */}
                {userRole === "admin" ? (
                    <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                ) : (
                    <Link to="/usersettings" className={location.pathname === "/usersettings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                )}

                {/* Only show "Utilisateurs" and "Clients" links for admin */}
                {userRole === "admin" && (
                    <>
                        <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                            <FiUser />
                            {isOpen && <span> Utilisateurs</span>}
                        </Link>
                        <Link to="/clients" className={location.pathname === "/clients" ? "active" : ""}>
                            <FiUsers />
                            {isOpen && <span> Clients</span>}
                        </Link>
                    </>
                )}
            </nav>

            {/* Logout link positioned at the bottom */}
            <div className="logout" onClick={handleLogout}>
                <FiLogOut />
                {isOpen && <span>Déconnexion</span>}
            </div>
        </div>
    );
}

export default Sidebar;
