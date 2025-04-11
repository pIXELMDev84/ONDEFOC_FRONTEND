import { useState, useEffect } from "react"
import axios from "axios"
import {
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiCalendar,
  FiList,
  FiShoppingBag,
  FiBox,
} from "react-icons/fi"
import "../css/BonJournalier.css"

// Importez votre sidebar existante
import Sidebar from "./Slidebar"

const BonJournalier = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [retraits, setRetraits] = useState([])
  const [bonCode, setBonCode] = useState("") // Stocke le code du bon créé
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [animateForm, setAnimateForm] = useState(false)

  

  // Charger les catégories et les produits en stock
  useEffect(() => {
    // Ajouter une animation au chargement initial
    setAnimateForm(true)

    setLoading(true)
    axios
      .get("http://localhost:8000/api/stock-global")
      .then((response) => {
        setCategories(response.data.categories)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur de chargement:", error)
        setMessage({
          text: "Erreur lors du chargement des catégories et produits",
          type: "error",
        })
        setLoading(false)
      })
  }, [])

  // Ajouter un produit au bon journalier
  const addRetrait = () => {
    if (!selectedCategory || !selectedProduct || !quantity) {
      setMessage({
        text: "Veuillez sélectionner une catégorie, un produit et une quantité.",
        type: "error",
      })
      return
    }

    const produit = categories
      .find((cat) => cat.id === Number.parseInt(selectedCategory))
      ?.products.find((prod) => prod.id === Number.parseInt(selectedProduct))

    if (!produit || quantity > produit.quantite) {
      setMessage({
        text: "Stock insuffisant !",
        type: "error",
      })
      return
    }

    setRetraits([
      ...retraits,
      {
        produit_id: selectedProduct,
        quantite_retirer: Number.parseInt(quantity),
        produit_nom: produit.name,
        categorie_nom: categories.find((cat) => cat.id === Number.parseInt(selectedCategory)).name,
      },
    ])

    setMessage({
      text: "Produit ajouté avec succès !",
      type: "success",
    })

    setSelectedProduct("")
    setQuantity("")
  }

  // Supprimer un produit ajouté
  const removeRetrait = (index) => {
    setRetraits(retraits.filter((_, i) => i !== index))
    setMessage({
      text: "Produit retiré de la liste",
      type: "info",
    })
  }

  // Soumettre le bon journalier
  const submitBonJournalier = () => {
    if (retraits.length === 0) {
      setMessage({
        text: "Ajoutez au moins un produit !",
        type: "error",
      })
      return
    }

    setLoading(true)
    axios
      .post("http://localhost:8000/api/create/bons-journaliers", {
        date: new Date().toISOString().split("T")[0],
        produits: retraits,
      })
      .then((response) => {
        setBonCode(response.data.bon_journalier.code)
        setRetraits([])
        setMessage({
          text: "Bon journalier créé avec succès !",
          type: "success",
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur de soumission:", error)
        setMessage({
          text: "Erreur lors de la création du bon journalier",
          type: "error",
        })
        setLoading(false)
      })
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className={`bon-journalier-container ${animateForm ? "animate-in" : ""}`}>
          <div className="bon-journalier-card">
            <div className="card-header">
              <FiShoppingBag className="card-icon" />
              <div>
                <h2 className="card-title">Créer un Bon Journalier</h2>
                <p className="card-description">Enregistrez les produits à retirer du stock</p>
              </div>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? (
                  <FiAlertCircle className="message-icon" />
                ) : message.type === "success" ? (
                  <FiCheckCircle className="message-icon" />
                ) : (
                  <FiAlertCircle className="message-icon" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {bonCode && (
              <div className="bon-code">
                <FiCalendar className="bon-code-icon" />
                <div>
                  <span className="bon-code-label">Bon Journalier créé :</span>
                  <span className="bon-code-value">{bonCode}</span>
                </div>
              </div>
            )}

            <form className="bon-journalier-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categorie">
                    <FiList className="input-icon" /> Catégorie :
                  </label>
                  <select
                    id="categorie"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="animated-input"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="produit">
                    <FiBox className="input-icon" /> Produit :
                  </label>
                  <select
                    id="produit"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled={!selectedCategory}
                    className="animated-input"
                  >
                    <option value="">Sélectionner un produit</option>
                    {selectedCategory &&
                      categories
                        .find((cat) => cat.id === Number.parseInt(selectedCategory))
                        ?.products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} (Stock: {prod.quantite})
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantite">
                    <FiPackage className="input-icon" /> Quantité :
                  </label>
                  <input
                    id="quantite"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!selectedProduct}
                    min="1"
                    className="animated-input"
                  />
                </div>

                <div className="form-group button-group">
                  <button
                    type="button"
                    onClick={addRetrait}
                    disabled={!selectedProduct || !quantity}
                    className="btn-add"
                  >
                    <FiPlus /> Ajouter
                  </button>
                </div>
              </div>
            </form>

            <div className="retraits-section">
              <div className="retraits-header">
                <h3>
                  <FiList /> Produits à retirer
                </h3>
              </div>

              {retraits.length === 0 ? (
                <div className="no-retraits">
                  <FiPackage className="no-retraits-icon" />
                  <p>Aucun produit ajouté. Veuillez ajouter des produits à retirer.</p>
                </div>
              ) : (
                <div className="retraits-list">
                  {retraits.map((item, index) => (
                    <div key={index} className="retrait-item">
                      <div className="retrait-info">
                        <span className="retrait-categorie">{item.categorie_nom}</span>
                        <span className="retrait-nom">{item.produit_nom}</span>
                        <span className="retrait-quantite">Quantité: {item.quantite_retirer}</span>
                      </div>
                      <button type="button" onClick={() => removeRetrait(index)} className="btn-remove">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={submitBonJournalier}
                  disabled={retraits.length === 0 || loading}
                  className={`btn-submit ${loading ? "loading" : ""}`}
                >
                  {loading ? (
                    <>
                      <span className="loader"></span>
                      <span>Chargement...</span>
                    </>
                  ) : (
                    "Valider le bon journalier"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonJournalier;

