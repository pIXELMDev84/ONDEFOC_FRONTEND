"use client"

import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Slidebar.jsx"
import "../css/Settings.css"



function Settings() {
  const navigate = useNavigate()

  const navigateTo = (path) => {
    navigate(path)
  }

  const cards = [
    {
      title: "Enregistrer un Utilisateur",
      description: "Ajoutez un nouveau compte utilisateur dans le système.",
      path: "/settings/addUser",
      icon: "👤", // Icône utilisateur
    },
    {
      title: "Enregistrer un Fournisseur",
      description: "Ajoutez un nouveau compte Fournisseur dans le système.",
      path: "/settings/addFourni",
      icon: "🏢", // Icône entreprise/fournisseur
    },
    {
      title: "Créer Un Bon De Commande",
      description: "Créez un Bon De commande dans le système.",
      path: "/BonDeCommande/creation",
      icon: "📝", // Icône document/commande
    },
    {
      title: "Créer Un Bon De Réception",
      description: "Créez un Bon De Réception dans le système.",
      path: "/BonDeReseption/creation",
      icon: "📦", // Icône colis/réception
    },
    {
      title: "Ajouter un Produit",
      description: "Ajoutez un produit au système.",
      path: "/AjouterProduit",
      icon: "🛍️", // Icône produit
    },
    {
      title: "Établir les États de Sortie",
      description: "Retirez une quantité consommée du stock.",
      path: "/BonJournalierForm",
      icon: "📊", // Icône graphique/statistiques
    },
  ]

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="settings-container">
          {/* Titre et sous-titre centrés */}
          <div className="page-title">
            <h1>Paramètres Gestion</h1>
            <p>Configurez et gérez les paramètres du système</p>
          </div>

          <div className="cards-grid">
            {cards.map((card, index) => (
              <div key={index} className="card" onClick={() => navigateTo(card.path)}>
                <div className="card-content">
                  <div className="card-icon">
                    <span className="icon">{card.icon}</span>
                  </div>
                  <div className="card-text">
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                  </div>
                </div>
                <div className="card-arrow">
                  <span className="arrow-icon">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
