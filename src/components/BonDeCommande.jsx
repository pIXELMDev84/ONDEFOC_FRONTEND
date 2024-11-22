import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import "../css/BonDeCommande.css";

const BonDeCommande = () => {
  const [fournisseurId, setFournisseurId] = useState(1);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produitName, setProduitName] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [tva, setTva] = useState(0);
  const [date, setDate] = useState('');
  const [prixTotal, setPrixTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/fournisseurs');
        setFournisseurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs", error);
        setMessage('Erreur lors de la récupération des fournisseurs');
      }
    };
    fetchFournisseurs();
  }, []);

  const calculateTotalPrice = () => {
    const total = prixUnitaire * quantite * (1 + tva / 100);
    setPrixTotal(total);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    setLoading(true); // Début du chargement

    try {
      const response = await axios.post('http://localhost:8000/api/bdcm', data);
      setMessage('Bon de commande créé avec succès');
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la création du bon de commande', error);
      setMessage('Erreur lors de la création du bon de commande');
    } finally {
      setLoading(false); // Fin du chargement
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

          <button type="submit" disabled={loading}>Créer le bon de commande</button>
        </form>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default BonDeCommande;
