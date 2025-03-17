import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { GiChickenLeg, GiWheat, GiFruitBowl, GiOpenChest } from "react-icons/gi";
import Sidebar from "./Slidebar.jsx";
import "../css/EtatDeStock.css";

const StockGlobal = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [consumption, setConsumption] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/stock-global")
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
        return <GiOpenChest className="category-icon" />;
    }
  };

  const openPopup = (category) => {
    setSelectedCategory(category);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCategory(null);
    setConsumption({});
  };

  const handleConsumptionChange = (productId, value) => {
    setConsumption((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    const consumptionData = Object.entries(consumption).map(([productId, quantity]) => ({
      produit_id: productId,
      quantite_retiree: parseInt(quantity, 10),
    }));

    try {
      const response = await fetch("http://localhost:8000/api/consommation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consommation: consumptionData }),
      });

      if (response.ok) {
        alert("Consommation enregistrée !");
        closePopup();
        window.location.reload(); // Recharger les données après retrait
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
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
                    <th>Retirer</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategory.products.length > 0 ? (
                    selectedCategory.products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.quantite}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={product.quantite}
                            value={consumption[product.id] || ""}
                            onChange={(e) => handleConsumptionChange(product.id, e.target.value)}
                          />
                        </td>
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
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Traitement..." : "Valider Retrait"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockGlobal;
