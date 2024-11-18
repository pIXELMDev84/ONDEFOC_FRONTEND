// src/pages/Settings.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Slidebar.jsx";
import "../css/Settings.css";

function MagasinierSettings() {
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

export default MagasinierSettings;
