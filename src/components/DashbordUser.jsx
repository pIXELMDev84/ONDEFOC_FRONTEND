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
  const [error, setError] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [updatedUser, setUpdatedUser] = useState({ nom: "", prenom: "", email: "" })
  const navigate = useNavigate()
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setUpdatedUser({ nom: parsedUser.nom, prenom: parsedUser.prenom, email: parsedUser.email })
    } else {
      navigate("/login")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("token")
    navigate("/login")
  }

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?"

  const openPopup = (category) => {
    setSelectedCategory(category)
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
    setSelectedCategory(null)
  }

  const openProfileModal = () => setShowProfileModal(true)
  const closeProfileModal = () => setShowProfileModal(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser((prev) => ({ ...prev, [name]: value }))
  }
  const handleProfileUpdate = async () => {
    if (!updatedUser.nom || !updatedUser.prenom || !updatedUser.email) {
      showNotification("Tous les champs doivent être remplis.", "error");
      return;
    }
  
    try {
      const url = `http://localhost:8000/api/update/users/${user?.id}`;
      const response = await axios.put(url, updatedUser);
      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
      closeProfileModal();
  
      // Afficher une notification de succès
      showNotification("Profil mis à jour avec succès.", "success");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error.response || error.message);
  
      // Afficher une notification d'erreur
      showNotification(
        error.response?.data?.message || "Erreur lors de la mise à jour du profil.",
        "error"
      );
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", visible: false });
    }, 3000); // La notification disparaît après 3 secondes
  };
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:8000/api/stock-global")
        setStockData(response.data.categories)
      } catch (error) {
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
      }
      setIsLoading(false)
    }

    fetchStockData()
    const interval = setInterval(fetchStockData, 300000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryIcon = (name) => {
    switch (name) {
      case "ALIMENTATION GENERALE": return <FiShoppingCart className="category-icon" />
      case "VIANDE POISSON + OEUF": return <GiChickenLeg className="category-icon" />
      case "PATISSERIE": return <GiWheat className="category-icon" />
      case "FRUIT ET LEGUMES": return <GiFruitBowl className="category-icon" />
      default: return <FiShoppingCart className="category-icon" />
    }
  }

  const getCategoryColor = (name) => {
    switch (name) {
      case "ALIMENTATION GENERALE": return "#FF6384"
      case "VIANDE POISSON + OEUF": return "#36A2EB"
      case "PATISSERIE": return "#FFCE56"
      case "FRUIT ET LEGUMES": return "#4BC0C0"
      default: return "#9966FF"
    }
  }

  const totalGlobalProduits = stockData.reduce((sum, cat) => sum + (cat.products?.length || 0), 0)
  const totalGlobalQuantite = stockData.reduce(
    (sum, cat) => sum + (cat.products?.reduce((s, p) => s + (p.quantite || 0), 0) || 0),
    0,
  )

  return (
    <div className="dashboard">
      
      <Sidebar />
      {notification.visible && (
  <div className={`notification ${notification.type}`}>
    {notification.message}
  </div>
)}
      <div className="main-content">
        <div className="dashboard-container">
          {/* Résumé global */}
          <div className="top-section">
            <div className="summary-card">
              <div className="card-header"><h3>Résumé global</h3></div>
              <div className="card-body">
                <div className="summary-stats">
                  <div className="stat-item">
                    <div className="big-number blue">{totalGlobalProduits}</div>
                    <div className="stat-label">Produits</div>
                  </div>
                  <div className="stat-item">
                    <div className="big-number green">{totalGlobalQuantite}</div>
                    <div className="stat-label">Quantité totale</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Répartition par catégorie */}
            <div className="distribution-card">
              <div className="card-header"><h3>Répartition par catégorie</h3></div>
              <div className="card-body">
                {isLoading ? (
                  <div className="loading-container"><div className="spinner"></div></div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <div className="category-list">
                    {stockData.map((category) => {
                      const percent = totalGlobalProduits > 0
                        ? (category.products?.length || 0) / totalGlobalProduits * 100 : 0
                      return (
                        <div className="category-item" key={category.id || category.name}>
                          <div className="category-info">
                            <div className="category-dot" style={{ backgroundColor: getCategoryColor(category.name) }}></div>
                            <div className="category-name">{category.name}</div>
                            <div className="category-count">{category.products?.length || 0} ({percent.toFixed(1)}%)</div>
                          </div>
                          <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${percent}%`, backgroundColor: getCategoryColor(category.name) }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Catégories */}
          <div className="categories-section">
            <h3 className="section-title">Catégories</h3>
            <div className="categories-row">
              {isLoading ? (
                <div className="loading-container"><div className="spinner"></div></div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                stockData.map((category) => {
                  const totalProduits = category.products?.length || 0
                  const totalQuantite = category.products?.reduce((sum, p) => sum + (p.quantite || 0), 0) || 0
                  return (
                    <div className="category-wrapper" key={category.id || category.name}>
                      <div className="category-card" onClick={() => openPopup(category)}>
                        <div className="category-stats-top">
                          <div className="stat-row"><div className="stat-label">PRODUITS:</div><div className="stat-number">{totalProduits}</div></div>
                          <div className="stat-row"><div className="stat-label">QUANTITÉ:</div><div className="stat-number">{totalQuantite}</div></div>
                        </div>
                        <div className="category-icon-container" style={{ backgroundColor: getCategoryColor(category.name) }}>
                          {getCategoryIcon(category.name)}
                        </div>
                        <h4 className="category-title">{category.name}</h4>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Welcome Card avec Mon Compte */}
        <div className="welcome-card">
          <div className="user-info">
            <div className="avatar"><span>{getInitial(user?.nom)}</span></div>
            <div className="user-details">
              <h2>Bienvenue,<br />{user.nom} {user.prenom}</h2>
              <p>{user?.role || "admin"}</p>
              <button onClick={openProfileModal} className="mon-compte-btn">Mon compte</button>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><FiLogOut /> Déconnexion</button>
        </div>

        {/* Popup produits par catégorie */}
        {showPopup && selectedCategory && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">
                  <div className="popup-category-icon" style={{ backgroundColor: getCategoryColor(selectedCategory.name) }}>
                    {getCategoryIcon(selectedCategory.name)}
                  </div>
                  <h3>{selectedCategory.name}</h3>
                </div>
                <button className="modal-close" onClick={closePopup}>×</button>
              </div>
              <div className="modal-content">
                <table className="products-table">
                  <thead><tr><th>Nom</th><th>Quantité</th></tr></thead>
                  <tbody>
                    {selectedCategory.products?.length > 0 ? (
                      selectedCategory.products.map((product) => (
                        <tr key={product.id || product.name}><td>{product.name}</td><td>{product.quantite}</td></tr>
                      ))
                    ) : (
                      <tr><td colSpan="2" className="no-data">Aucun produit disponible</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer"><button className="modal-btn" onClick={closePopup}>Fermer</button></div>
            </div>
          </div>
        )}

        {/* Popup modification du profil */}
        {showProfileModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <div className="modal-header">
        <h3>Modifier mon profil</h3>
        <button className="modal-close" onClick={closeProfileModal}>×</button>
      </div>
      <div className="modal-content">
        <label>Nom:</label>
        <input
          className="profile-input"
          name="nom"
          value={updatedUser.nom}
          onChange={handleInputChange}
        />
        <label>Prénom:</label>
        <input
          className="profile-input"
          name="prenom"
          value={updatedUser.prenom}
          onChange={handleInputChange}
        />
        <label>Email:</label>
        <input
          className="profile-input"
          name="email"
          value={updatedUser.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="modal-footer">
        <button className="modal-btn" onClick={handleProfileUpdate}>Enregistrer</button>
        <button className="modal-btn cancel" onClick={closeProfileModal}>Annuler</button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  )
}


export default DashboardUser;