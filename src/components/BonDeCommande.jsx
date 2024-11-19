import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import "../css/BonDeCommande.css";

const BonDeCommande = () => {
  const [fournisseurId, setFournisseurId] = useState(1); // ID du fournisseur
  const [fournisseurs, setFournisseurs] = useState([]); // Liste des fournisseurs
  const [produitName, setProduitName] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [tva, setTva] = useState(0);
  const [date, setDate] = useState('');
  const [prixTotal, setPrixTotal] = useState(0); // Prix total calculé
  const [message, setMessage] = useState('');

  // Fonction pour récupérer la liste des fournisseurs
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        // Remplace l'URL par celle qui correspond à ton API pour récupérer les fournisseurs
        const response = await axios.get('http://localhost:8000/api/fournisseurs');
        setFournisseurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs", error);
        setMessage('Erreur lors de la récupération des fournisseurs');
      }
    };
    fetchFournisseurs();
  }, []);

  // Fonction pour calculer le prix total
  const calculateTotalPrice = () => {
    const total = prixUnitaire * quantite * (1 + tva / 100);
    setPrixTotal(total);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérification simple des champs
    if (!produitName || !date) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    const data = {
      fournisseur_id: fournisseurId,
      produit_name: produitName,
      quantite: quantite,
      prix_unitaire: prixUnitaire,
      tva: tva,
      date: date,
    };

    try {
      // Envoi des données au backend Laravel
      const response = await axios.post('http://localhost:8000/api/bdcm', data);

      // Affichage du message de succès et de la réponse du backend
      setMessage('Bon de commande créé avec succès');
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la création du bon de commande', error);
      setMessage('Erreur lors de la création du bon de commande');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="form-container">
        <h2>Créer un bon de commande</h2>
        {message && <p className="error">{message}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Nom du produit:</label>
            <input
              type="text"
              value={produitName}
              onChange={(e) => setProduitName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Quantité:</label>
            <input
              type="number"
              value={quantite}
              onChange={(e) => {
                setQuantite(e.target.value);
                calculateTotalPrice();
              }}
              min="1"
              required
            />
          </div>
          <div>
            <label>Prix unitaire:</label>
            <input
              type="number"
              value={prixUnitaire}
              onChange={(e) => {
                setPrixUnitaire(e.target.value);
                calculateTotalPrice();
              }}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label>TVA (%):</label>
            <input
              type="number"
              value={tva}
              onChange={(e) => {
                setTva(e.target.value);
                calculateTotalPrice();
              }}
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Sélection du fournisseur */}
          <div>
            <label>Fournisseur:</label>
            <select
              value={fournisseurId}
              onChange={(e) => setFournisseurId(e.target.value)}
              required
            >
              {fournisseurs.map(fournisseur => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Prix total:</label>
            <input
              type="number"
              value={prixTotal}
              readOnly
            />
          </div>

          <button type="submit">Créer le bon de commande</button>
        </form>
      </div>
    </div>
  );
};

export default BonDeCommande;
