import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { GiChickenLeg, GiWheat, GiFruitBowl, GiOpenChest } from 'react-icons/gi';
import Sidebar from './Slidebar'; // Assurez-vous que le chemin d'importation est correct
import "../css/EtatDeStock.css";

const EtatDeStock = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <h2>État du Stock</h2>

        {/* Stock global */}
        <div className="stock-overview">
          <h3>Stock Global</h3>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: "75%" }}>
              75%
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="categories">
          {/* Alimentation Générale */}
          <div className="category">
            <FiShoppingCart size={40} className="category-icon" />
            <h3>Alimentation Générale</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "90%" }}>
                90%
              </div>
            </div>
            <p>État actuel : Bon</p>
          </div>

          {/* Fruits et Légumes */}
          <div className="category">
            <GiFruitBowl size={40} className="category-icon" />
            <h3>Fruits et Légumes</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "40%" }}>
                40%
              </div>
            </div>
            <p>État actuel : Faible</p>
          </div>

          {/* Viande + Poisson + Œuf */}
          <div className="category">
            <GiChickenLeg size={40} className="category-icon" />
            <h3>Viande + Poisson + Œuf</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "60%" }}>
                60%
              </div>
            </div>
            <p>État actuel : Moyen</p>
          </div>

          {/* Pain et Pâtisserie */}
          <div className="category">
            <GiWheat size={40} className="category-icon" />
            <h3>Pain et Pâtisserie</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "30%" }}>
                30%
              </div>
            </div>
            <p>État actuel : Faible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtatDeStock;
