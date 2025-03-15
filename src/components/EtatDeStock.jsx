import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi"; 
import { GiChickenLeg, GiWheat, GiFruitBowl, GiOpenChest } from "react-icons/gi"; 
import Sidebar from "./Slidebar"; 
import "../css/EtatDeStock.css";

const EtatDeStock = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/stock-global") // Change l'URL si besoin
      .then((response) => response.json())
      .then((data) => setStockData(data.categories))
      .catch((error) => console.error("Erreur de chargement:", error));
  }, []);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case "ALIMENTATION GENERALE":
        return <FiShoppingCart className="category-icon" />;
      case "VIANDE POISSON + OEUF":
        return <GiChickenLeg className="category-icon" />;
      case "PATISSERIE":
        return <GiWheat className="category-icon" />;
      case "FRUIT ET LEGUMES":
        return <GiFruitBowl className="category-icon" />;
      default:
        return <GiOpenChest className="category-icon" />; // Par défaut, une icône générique
    }
  };

  const openPopup = (category) => {
    setSelectedCategory(category);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCategory(null);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <h2>État du Stock</h2>

        <div className="categories">
          {stockData.map((category) => {
            const totalProduits = category.products.length;
            const totalQuantite = category.products.reduce((sum, p) => sum + p.quantite, 0);

            return (
              <div key={category.id} className="category" onClick={() => openPopup(category)}>
                {getCategoryIcon(category.name)}
                <h3>{category.name}</h3>
                <span className="counter">{totalProduits} Produits</span>
                <span className="total-quantite">Total : {totalQuantite}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && selectedCategory && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>X</button>
            <h3>{selectedCategory.name}</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategory.products.length > 0 ? (
                    selectedCategory.products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.quantite}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">Aucun produit disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtatDeStock;
