import React, { useEffect, useState } from "react";
import "../css/DashboardAdmin.css";
import Sidebar from "./Slidebar.jsx";
import { useNavigate } from "react-router-dom";

function DashbordMagasinier() {
    const user = JSON.parse(localStorage.getItem('user')); // Récupérer les informations de l'utilisateur
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // État pour stocker les utilisateurs

    const greeting = user ? `Bonsoir, ${user.nom} ${user.prenom}` : "Bienvenue, Restaurateur"; // Message par défaut si aucun utilisateur

    const handleLogout = () => {
        localStorage.removeItem('user'); // Supprimer les informations de l'utilisateur du stockage local
        navigate("/login"); // Rediriger vers la page de connexion
    };

   
    return (
        <div className="dashboard">
        <Sidebar /> {/* Ajout du menu latéral */}
        <div className="main-content">
            <header className="header">
                <h1>Bienvenue, {user ? `${user.nom} ${user.prenom}` : "Admin"}</h1>
                <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
            </header>
        </div>
                <section>
                   
                    <ul>
                        {users
                            .filter(u => u.id !== user.id) // Exclure l'utilisateur connecté
                            .map(u => (
                                <li key={u.id}>
                                    {u.prenom} {u.nom} - {u.email} - {u.role}
                                </li>
                            ))}
                    </ul>
                </section>
            </div>
       
    );
}

export default DashbordMagasinier;