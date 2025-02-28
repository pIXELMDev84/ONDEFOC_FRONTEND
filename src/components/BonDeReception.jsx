import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "../css/BonDeCommande.css";

const BonDeReception = () => {
  const [bonCommandeId, setBonCommandeId] = useState("");
  const [bonsDeCommande, setBonsDeCommande] = useState([]);
  const [fournisseurId, setFournisseurId] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produitsDisponibles, setProduitsDisponibles] = useState([]);
  const [selectedProduits, setSelectedProduits] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fournisseurs");
        setFournisseurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs", error);
      }
    };
    fetchFournisseurs();
  }, []);

  useEffect(() => {
    const fetchBonsDeCommande = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdcm");
        setBonsDeCommande(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de commande", error);
      }
    };
    fetchBonsDeCommande();
  }, []);

  const handleBonCommandeChange = async (id) => {
    setBonCommandeId(id);
    if (id) {
      try {
        const response = await axios.get(`http://localhost:8000/api/bondecommande/${id}/produits`);
        console.log(response.data);
        setProduitsDisponibles(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits", error);
        setProduitsDisponibles([]);
      }
    } else {
      setProduitsDisponibles([]);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduits([...selectedProduits, { produit_id: "", quantite_recu: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProduits = [...selectedProduits];
    updatedProduits.splice(index, 1);
    setSelectedProduits(updatedProduits);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProduits = [...selectedProduits];
    updatedProduits[index][field] = value;
    setSelectedProduits(updatedProduits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!bonCommandeId || !fournisseurId || selectedProduits.length === 0) {
      setMessage("Veuillez remplir tous les champs correctement.");
      return;
    }

    const data = {
      bon_commande_id: parseInt(bonCommandeId),
      fournisseur_id: parseInt(fournisseurId),
      produits: selectedProduits.map((produit) => ({
        produit_id: parseInt(produit.produit_id),
        quantite_recu: parseInt(produit.quantite_recu),
      })),
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/bdrs", data);
      setMessage("Bon de réception créé avec succès.");
      setSelectedProduits([]);
      setBonCommandeId("");
      setDate("");
    } catch (error) {
      console.error("Erreur lors de la création du bon de réception", error);
      setMessage("Erreur lors de la création du bon de réception.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="form-container">
        <h2>Créer un bon de réception</h2>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Bon de commande :</label>
            <select
              value={bonCommandeId}
              onChange={(e) => handleBonCommandeChange(e.target.value)}
              required
            >
              <option value="">Sélectionner un bon de commande</option>
              {bonsDeCommande.map((bon) => (
                <option key={bon.id} value={bon.id}>{`Bon #${bon.id}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Fournisseur :</label>
            <select value={fournisseurId} onChange={(e) => setFournisseurId(e.target.value)} required>
              <option value="">Sélectionner un fournisseur</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>{fournisseur.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Date :</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <h3>Produits reçus</h3>
          {selectedProduits.map((produit, index) => (
            <div key={index} className="product-row">
              <select
                value={produit.produit_id}
                onChange={(e) => handleProductChange(index, "produit_id", e.target.value)}
                required
              >
                <option value="">Sélectionner un produit</option>
                {produitsDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantité reçue"
                value={produit.quantite_recu}
                onChange={(e) => handleProductChange(index, "quantite_recu", e.target.value)}
                required
              />
              <button type="button" onClick={() => handleRemoveProduct(index)}><FiTrash2 /></button>
            </div>
          ))}

          <button type="button" onClick={handleAddProduct}><FiPlus /> Ajouter un produit</button>
          <button type="submit" disabled={loading}>{loading ? "Chargement..." : "Créer"}</button>
        </form>
      </div>
    </div>
  );
};

export default BonDeReception;
