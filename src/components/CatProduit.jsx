import { useState, useEffect } from "react";
import { GiShoppingCart, GiFruitBowl, GiMeat, GiWheat } from "react-icons/gi";
import Modal from "react-modal";
import Sidebar from "./Slidebar.jsx"; // Importation de la slidebar
import "../css/CatProduit.css"; // Fichier CSS

const categories = [
  { id: 1, nom: "Alimentation Générale", icon: <GiShoppingCart /> },
  { id: 4, nom: "Fruits et Légumes", icon: <GiFruitBowl /> },
  { id: 2, nom: "Viande + Poisson + Œuf", icon: <GiMeat /> },
  { id: 3, nom: "Pain et Pâtisserie", icon: <GiWheat /> },
];

export default function Categories() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [produits, setProduits] = useState([]);
  const [categorieNom, setCategorieNom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compteurs, setCompteurs] = useState({}); // Stocke le nombre de produits par catégorie

  

  // Récupérer le nombre de produits par catégorie
  useEffect(() => {
    const fetchCounts = async () => {
      const newCompteurs = {};
      for (const categorie of categories) {
        try {
          const response = await fetch(`http://localhost:8000/api/produits/categorie/${categorie.id}/count`);
          const data = await response.json();
          newCompteurs[categorie.id] = data.count || 0; // Mettre 0 si aucun produit
        } catch (error) {
          console.error("Erreur lors de la récupération du compteur :", error);
          newCompteurs[categorie.id] = 0;
        }
      }
      setCompteurs(newCompteurs);
    };

    fetchCounts();
  }, []);

  // Récupérer les produits d'une catégorie
  const openModal = async (categorieId, nom) => {
    setCategorieNom(nom);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/produits/categorie/${categorieId}`);
      const data = await response.json();

      if (response.ok) {
        setProduits(data);
      } else {
        setProduits([]);
        setError("Aucun produit trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      setError("Une erreur s'est produite lors du chargement.");
      setProduits([]);
    }

    setLoading(false);
    setModalIsOpen(true);
  };

  return (
    <div className="dashboard">
      <Sidebar /> {/* Sidebar incluse */}
      <div className="main-content">
        <h1>Liste des Produits</h1>
        <h3>Cliquer sur une des catégories pour afficher la liste des produits</h3>
        <div className="category-container">
          {categories.map((categorie) => (
            <div key={categorie.id} className="category-card" onClick={() => openModal(categorie.id, categorie.nom)}>
              <p className="counter">{compteurs[categorie.id] || 0} Produits</p>
              <div className="icon">{categorie.icon}</div>
              <p>{categorie.nom}</p>
            </div>
          ))}
        </div>

        {/* MODAL POUR AFFICHER LES PRODUITS */}
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal">
          <h2>{categorieNom}</h2>
          {loading ? (
            <p className="loading">Chargement...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>TVA</th>
                  <th>Unité de Mesure</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((produit) => (
                  <tr key={produit.id}>
                    <td>{produit.nom}</td>
                    <td>{produit.tva}%</td>
                    <td>{produit.unite_mesure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      </div>
    </div>
  );
}
