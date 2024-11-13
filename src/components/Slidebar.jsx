// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiSettings, FiUser, FiUsers, FiLogOut } from "react-icons/fi"; // Import FiLogOut icon
import "../css/Sidebar.css";

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
        <nav>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                <FiHome />
                {isOpen && <span> Dashboard</span>}
            </Link>

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

            <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                <FiUser />
                {isOpen && <span> Utilisateurs</span>}
            </Link>
            <Link to="/clients" className={location.pathname === "/clients" ? "active" : ""}>
                <FiUsers />
                {isOpen && <span> Clients</span>}
            </Link>
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
