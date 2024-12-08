import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import "../css/AjouterProduit.css";

const AjouterProduit = () => {
  // États pour les champs du formulaire
  const [nom, setNom] = useState('');
  const [tva, setTva] = useState(0);
  const [uniteMesure, setUniteMesure] = useState('UNITE');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const unites = [
    "BIDON", "BOITE", "BOT", "BOUTEILLES", 
    "KILOGRAMME", "PAQUETS", "PLATEAU", 
    "POT", "UNITE"
  ];

  // Charger les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nom || !categoryId) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    const data = {
      nom: nom.trim(),
      tva: parseFloat(tva),
      unite_mesure: uniteMesure,
      categories_id: parseInt(categoryId), // Champ corrigé
    };

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/produits/add', data);
      setMessage('Produit ajouté avec succès.');
      console.log(response.data);

      // Réinitialisation des champs
      setNom('');
      setTva(0);
      setUniteMesure('UNITE');
      setCategoryId('');
    } catch (error) {
      console.error('Erreur lors de l’ajout du produit', error.response ? error.response.data : error);
      setMessage('Erreur lors de l’ajout du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="form-container">
        <h2>Ajouter un produit</h2>
        {message && <p className={message.includes('Erreur') ? 'error' : 'success'}>{message}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Nom du produit:</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div>
            <label>TVA (%):</label>
            <input
              type="number"
              value={tva}
              onChange={(e) => setTva(e.target.value)}
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Unité de mesure:</label>
            <select
              value={uniteMesure}
              onChange={(e) => setUniteMesure(e.target.value)}
              required
            >
              {unites.map((u, index) => (
                <option key={index} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Catégorie:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>Ajouter le produit</button>
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

export default AjouterProduit;
