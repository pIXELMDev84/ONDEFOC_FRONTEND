import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import "../css/BonDeCommande.css";

const BonDeCommande = () => {
  const [fournisseurId, setFournisseurId] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
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
        setMessage("Erreur lors de la récupération des fournisseurs");
      }
    };
    fetchFournisseurs();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      if (fournisseurId) {
        try {
          const response = await axios.get(`http://localhost:8000/api/produits?fournisseur_id=${fournisseurId}`);
          setProduits(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des produits", error);
          setMessage("Erreur lors de la récupération des produits");
        }
      }
    };
    fetchProduits();
  }, [fournisseurId]);

  const handleAddProduct = () => {
    setSelectedProduits([
      ...selectedProduits,
      { produitId: "", nom: "", quantite: 1, prixUnitaire: "", tva: "", unite: "" },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProduits = [...selectedProduits];
    updatedProduits.splice(index, 1);
    setSelectedProduits(updatedProduits);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProduits = [...selectedProduits];
    updatedProduits[index][field] = value;

    if (field === "produitId") {
      const selectedProduct = produits.find((p) => p.id === parseInt(value));
      if (selectedProduct) {
        updatedProduits[index].nom = selectedProduct.nom;
        updatedProduits[index].unite = selectedProduct.unite_mesure || "";
        updatedProduits[index].tva = selectedProduct.tva;
      }
    }

    setSelectedProduits(updatedProduits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fournisseurId || !date || selectedProduits.length === 0) {
      setMessage("Veuillez remplir tous les champs correctement.");
      return;
    }

    const productsWithUnite = selectedProduits.map((produit) => ({
      ...produit,
      unite: produit.unite || "KILOGRAMME",
    }));

    const data = {
      fournisseur_id: parseInt(fournisseurId),
      date,
      produits: productsWithUnite.map((produit) => ({
        produit_id: parseInt(produit.produitId),
        quantite: parseInt(produit.quantite),
        prix_unitaire: parseFloat(produit.prixUnitaire),
        tva: parseFloat(produit.tva),
        unite: produit.unite,
        name: produit.nom,
      })),
    };

    console.log("Données envoyées :", data); // Log pour débogage

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/bdcm", data);
      console.log("Réponse du serveur :", response.data); // Log pour débogage
      setMessage("Bon de commande créé avec succès");
      setFournisseurId("");
      setDate("");
      setSelectedProduits([]);
    } catch (error) {
      console.error("Erreur serveur :", error.response?.data || error.message);
      setMessage("Erreur lors de la création du bon de commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="form-container">
        <h2>Créer un bon de commande</h2>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Fournisseur:</label>
            <select value={fournisseurId} onChange={(e) => setFournisseurId(e.target.value)} required>
              <option value="">Sélectionner un fournisseur</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div>
            <h3>Produits</h3>
            {selectedProduits.map((produit, index) => (
              <div key={index} className="product-row">
                <select
                  value={produit.produitId}
                  onChange={(e) => handleProductChange(index, "produitId", e.target.value)}
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={produit.quantite}
                  onChange={(e) => handleProductChange(index, "quantite", e.target.value)}
                  placeholder="Quantité"
                  required
                />
                <input
                  type="text"
                  value={produit.prixUnitaire}
                  onChange={(e) => handleProductChange(index, "prixUnitaire", e.target.value)}
                  placeholder="Prix unitaire (€)"
                  required
                />
                <span>TVA: {produit.tva}%</span>
                <span>Unité: {produit.unite}</span>
                <button type="button" onClick={() => handleRemoveProduct(index)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddProduct}>
              <FiPlus /> Ajouter un produit
            </button>
          </div>

          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Chargement..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BonDeCommande;
