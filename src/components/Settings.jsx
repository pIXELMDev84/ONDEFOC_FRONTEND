// src/pages/Settings.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Slidebar.jsx"; // Import du composant Sidebar
import "../css/Settings.css";

function Settings() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard"> {/* Conteneur parent */}
            <Sidebar /> {/* Sidebar */}
            <div className="main-content"> {/* Contenu principal */}
                <div className="settings-container">
                    <h1>Paramètres Utilisateur</h1>
                    <div className="cards-vertical">

                        <div className="card" onClick={() => navigateTo("/settings/addUser")}>
                            <h2>Enregistrer un Utilisateur</h2>
                            <p>Ajoutez un nouveau compte utilisateur dans le système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/settings/addFourni")}>
                            <h2>Enregistrer un Fournisseur</h2>
                            <p>Ajoutez un nouveau compte Fournisseur dans le système.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
