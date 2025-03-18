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
                    <h1>Paramètres Gestion</h1>
                    <div className="cards-vertical">

                        <div className="card" onClick={() => navigateTo("/settings/addUser")}>
                            <h2>Enregistrer un Utilisateur</h2>
                            <p>Ajoutez un nouveau compte utilisateur dans le système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/settings/addFourni")}>
                            <h2>Enregistrer un Fournisseur</h2>
                            <p>Ajoutez un nouveau compte Fournisseur dans le système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/BonDeCommande/creation")}>
                            <h2>Crée Un Bon De commande</h2>
                            <p>Crée un Bon De commande dans le système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/BonDeReseption/creation")}>
                            <h2>Crée Un Bon De Reseption</h2>
                            <p>Crée un Bon De Reseption dans le système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/AjouterProduit")}>
                            <h2>ajouter un produit</h2>
                            <p>ajouter un produit système.</p>
                        </div>
                        <div className="card" onClick={() => navigateTo("/BonJournalierForm")}>
                            <h2>etablir les etat de sortie</h2>
                            <p>retirer une quantité consomé du stock</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
