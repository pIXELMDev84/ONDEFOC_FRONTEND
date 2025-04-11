import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "./Slidebar.jsx"
import "../css/DashboardAdmin.css"
import { FiShoppingCart, FiLogOut } from "react-icons/fi"
import { GiChickenLeg, GiWheat, GiFruitBowl } from "react-icons/gi"

function DashboardUser() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {})
    const [stockData, setStockData] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
  
    // Fonction pour la déconnexion
    const handleLogout = () => {
      localStorage.removeItem("user")
      navigate("/login")
    }
  
    // Fonction pour récupérer l'initiale du nom
    const getInitial = (name) => {
      return name ? name.charAt(0).toUpperCase() : "?"
    }
  
    // Charger les données de stock
    useEffect(() => {
      const fetchStockData = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get("http://localhost:8000/api/stock-global")
          setStockData(response.data.categories)
          setIsLoading(false)
        } catch (error) {
          console.error("Erreur lors du chargement des données de stock:", error)
          setIsLoading(false)
        }
      }
  
      fetchStockData()
      const interval = setInterval(fetchStockData, 300000) // Rafraîchir toutes les 5 minutes
  
      return () => clearInterval(interval)
    }, [])
  
    // Fonctions pour les icônes et couleurs des catégories
    const getCategoryIcon = (categoryName) => {
      switch (categoryName) {
        case "ALIMENTATION GENERALE":
          return <FiShoppingCart className="category-icon" />
        case "VIANDE POISSON + OEUF":
          return <GiChickenLeg className="category-icon" />
        case "PATISSERIE":
          return <GiWheat className="category-icon" />
        case "FRUIT ET LEGUMES":
          return <GiFruitBowl className="category-icon" />
        default:
          return <FiShoppingCart className="category-icon" />
      }
    }
  
    const getCategoryColor = (categoryName) => {
      switch (categoryName) {
        case "ALIMENTATION GENERALE":
          return "#FF6384"
        case "VIANDE POISSON + OEUF":
          return "#36A2EB"
        case "PATISSERIE":
          return "#FFCE56"
        case "FRUIT ET LEGUMES":
          return "#4BC0C0"
        default:
          return "#9966FF"
      }
    }
  
    // Fonctions pour la popup
    const openPopup = (category) => {
      setSelectedCategory(category)
      setShowPopup(true)
    }
  
    const closePopup = () => {
      setShowPopup(false)
      setSelectedCategory(null)
    }
  
    // Calculs des totaux
    const totalGlobalProduits = stockData.reduce((sum, category) => sum + (category.products?.length || 0), 0)
    const totalGlobalQuantite = stockData.reduce(
      (sum, category) => sum + (category.products?.reduce((s, p) => s + (p.quantite || 0), 0) || 0),
      0,
    )
  
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <div className="dashboard-layout">
            {/* Colonne de gauche */}
            <div className="left-column">
              <div className="summary-card">
                <div className="card-header">
                  <h3>Résumé global</h3>
                </div>
                <div className="card-body">
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <div className="stat-value">{totalGlobalProduits}</div>
                      <div className="stat-label">Produits</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value">{totalGlobalQuantite}</div>
                      <div className="stat-label">Quantité totale</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Colonne du milieu */}
            <div className="middle-column">
              <div className="distribution-card">
                <div className="card-header">
                  <h3>Répartition par catégorie</h3>
                </div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <div className="category-list">
                      {stockData.map((category) => {
                        const percentage =
                          totalGlobalProduits > 0 ? ((category.products?.length || 0) / totalGlobalProduits) * 100 : 0
                        return (
                          <div className="category-item" key={category.id || category.name}>
                            <div className="category-info">
                              <div
                                className="category-dot"
                                style={{ backgroundColor: getCategoryColor(category.name) }}
                              ></div>
                              <div className="category-name">{category.name}</div>
                              <div className="category-count">
                                {category.products?.length || 0} ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <div className="progress-container">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: getCategoryColor(category.name),
                                }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* Colonne de droite */}
            <div className="right-column">
              <div className="categories-section">
                <h3 className="section-title">Catégories</h3>
                <div className="categories-grid">
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    stockData.map((category) => {
                      const totalProduits = category.products?.length || 0
                      const totalQuantite = category.products?.reduce((sum, p) => sum + (p.quantite || 0), 0) || 0
  
                      return (
                        <div
                          className="category-card"
                          key={category.id || category.name}
                          onClick={() => openPopup(category)}
                        >
                          <div
                            className="category-icon-container"
                            style={{ backgroundColor: getCategoryColor(category.name) }}
                          >
                            {getCategoryIcon(category.name)}
                          </div>
                          <h4 className="category-title">{category.name}</h4>
                          <div className="category-stats">
                            <div className="category-stat">
                              <div className="stat-number">{totalProduits}</div>
                              <div className="stat-text">Produits</div>
                            </div>
                            <div className="category-stat">
                              <div className="stat-number">{totalQuantite}</div>
                              <div className="stat-text">Quantité</div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Message de bienvenue en bas à droite */}
          <div className="welcome-card">
            <div className="user-info">
              <div className="avatar">
                <span>{getInitial(user?.nom)}</span>
              </div>
              <div className="user-details">
                <h2>Bienvenue, {user ? `${user.nom} ${user.prenom}` : "Admin"}</h2>
                <p>{user?.role || "admin"}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut /> Déconnexion
            </button>
          </div>
  
          {/* Popup pour les détails de la catégorie */}
          {showPopup && selectedCategory && (
            <div className="modal-backdrop">
              <div className="modal">
                <div className="modal-header">
                  <h3>
                    <span
                      className="modal-category-icon"
                      style={{ backgroundColor: getCategoryColor(selectedCategory.name) }}
                    >
                      {getCategoryIcon(selectedCategory.name)}
                    </span>
                    {selectedCategory.name}
                  </h3>
                  <button className="modal-close" onClick={closePopup}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Quantité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory.products && selectedCategory.products.length > 0 ? (
                        selectedCategory.products.map((product) => (
                          <tr key={product.id || product.name}>
                            <td>{product.name}</td>
                            <td>{product.quantite}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="no-data">
                            Aucun produit disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button className="modal-btn" onClick={closePopup}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  

export default DashboardUser;