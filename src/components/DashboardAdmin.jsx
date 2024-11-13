// src/pages/DashboardAdmin.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import "../css/DashboardAdmin.css";

function DashboardAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <h1>Bienvenue, {user ? `${user.nom} ${user.prenom}` : "Admin"}</h1>
                    <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                </header>
            </div>
        </div>
    );
}

export default DashboardAdmin;
