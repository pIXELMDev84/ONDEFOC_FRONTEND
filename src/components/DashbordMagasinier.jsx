import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import "../css/DashboardAdmin.css";

function DashbordMagasinier() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // Stocke les autres utilisateurs

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Fonction pour récupérer l'initiale du nom
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <div className="profile-card">
                    <div className="profile-icon">
                        {getInitial(user?.nom)}
                    </div>
                    <h2>{user ? `${user.nom} ${user.prenom}` : "Magasinier"}</h2>
                    <p><strong>Username: </strong>{user?.username || "Non défini"}</p>
                    <p><strong>Email:</strong> {user?.email || "Non défini"}</p>
                    <p><strong>Rôle:</strong> {user?.role || "Non défini"}</p>
                    <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                </div>
            </div>
        </div>
    );
}

export default DashbordMagasinier;
