"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "./Slidebar.jsx"
import {
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiShoppingCart,
  FiCalendar,
  FiDollarSign,
  FiPercent,
  FiPackage,
  FiTruck,
  FiList,
} from "react-icons/fi"
import "../css/BonDeCommande.css"

const BonDeCommande = () => {
  const [fournisseurId, setFournisseurId] = useState("")
  const [fournisseurs, setFournisseurs] = useState([])
  const [produits, setProduits] = useState([])
  const [selectedProduits, setSelectedProduits] = useState([])
  const [date, setDate] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const [loading, setLoading] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)

  
  useEffect(() => {
    // Ajouter une animation au chargement initial
    setAnimateForm(true)

    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fournisseurs")
        setFournisseurs(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs", error)
        setMessage({
          text: "Erreur lors de la récupération des fournisseurs",
          type: "error",
        })
      }
    }
    fetchFournisseurs()
  }, [])

  useEffect(() => {
    const fetchProduits = async () => {
      if (fournisseurId) {
        setLoading(true)
        try {
          const response = await axios.get(`http://localhost:8000/api/produits?fournisseur_id=${fournisseurId}`)
          setProduits(response.data)
          setLoading(false)
        } catch (error) {
          console.error("Erreur lors de la récupération des produits", error)
          setMessage({
            text: "Erreur lors de la récupération des produits",
            type: "error",
          })
          setLoading(false)
        }
      }
    }
    fetchProduits()
  }, [fournisseurId])

  const handleAddProduct = () => {
    setSelectedProduits([
      ...selectedProduits,
      { produitId: "", nom: "", quantite: 1, prixUnitaire: "", tva: "", unite: "" },
    ])
  }

  const handleRemoveProduct = (index) => {
    const updatedProduits = [...selectedProduits]
    updatedProduits.splice(index, 1)
    setSelectedProduits(updatedProduits)
  }

  const handleProductChange = (index, field, value) => {
    const updatedProduits = [...selectedProduits]
    updatedProduits[index][field] = value

    if (field === "produitId") {
      const selectedProduct = produits.find((p) => p.id === Number.parseInt(value))
      if (selectedProduct) {
        updatedProduits[index].nom = selectedProduct.nom
        updatedProduits[index].unite = selectedProduct.unite_mesure || ""
        updatedProduits[index].tva = selectedProduct.tva
      }
    }

    setSelectedProduits(updatedProduits)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!fournisseurId || !date || selectedProduits.length === 0) {
      setMessage({
        text: "Veuillez remplir tous les champs correctement.",
        type: "error",
      })
      return
    }

    const productsWithUnite = selectedProduits.map((produit) => ({
      ...produit,
      unite: produit.unite || "KILOGRAMME",
    }))

    const data = {
      fournisseur_id: Number.parseInt(fournisseurId),
      date,
      produits: productsWithUnite.map((produit) => ({
        produit_id: Number.parseInt(produit.produitId),
        quantite: Number.parseInt(produit.quantite),
        prix_unitaire: Number.parseFloat(produit.prixUnitaire),
        tva: Number.parseFloat(produit.tva),
        unite: produit.unite,
        name: produit.nom,
      })),
    }

    console.log("Données envoyées :", data) // Log pour débogage

    setLoading(true)
    try {
      const response = await axios.post("http://localhost:8000/api/bdcm", data)
      console.log("Réponse du serveur :", response.data) // Log pour débogage
      setMessage({
        text: "Bon de commande créé avec succès",
        type: "success",
      })
      setFournisseurId("")
      setDate("")
      setSelectedProduits([])
    } catch (error) {
      console.error("Erreur serveur :", error.response?.data || error.message)
      setMessage({
        text: "Erreur lors de la création du bon de commande",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculer le total du bon de commande
  const calculateTotal = () => {
    return selectedProduits
      .reduce((total, produit) => {
        if (produit.prixUnitaire && produit.quantite) {
          const prixHT = Number.parseFloat(produit.prixUnitaire) * Number.parseInt(produit.quantite)
          const tva = produit.tva ? (prixHT * Number.parseFloat(produit.tva)) / 100 : 0
          return total + prixHT + tva
        }
        return total
      }, 0)
      .toFixed(2)
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className={`bon-commande-container ${animateForm ? "animate-in" : ""}`}>
          <div className="bon-commande-card">
            <div className="card-header">
              <FiShoppingCart className="card-icon" />
              <div>
                <h2 className="card-title">Créer un bon de commande</h2>
                <p className="card-description">Commandez des produits auprès de vos fournisseurs</p>
              </div>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? (
                  <FiAlertCircle className="message-icon" />
                ) : (
                  <FiCheckCircle className="message-icon" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bon-commande-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fournisseur">
                    <FiTruck className="input-icon" /> Fournisseur:
                  </label>
                  <select
                    id="fournisseur"
                    value={fournisseurId}
                    onChange={(e) => setFournisseurId(e.target.value)}
                    required
                    className="animated-input"
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {fournisseurs.map((fournisseur) => (
                      <option key={fournisseur.id} value={fournisseur.id}>
                        {fournisseur.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">
                    <FiCalendar className="input-icon" /> Date:
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="animated-input"
                  />
                </div>
              </div>

              <div className="produits-section">
                <div className="produits-header">
                  <h3>
                    <FiList /> Produits
                  </h3>
                  <button type="button" onClick={handleAddProduct} className="btn-add-product">
                    <FiPlus /> Ajouter un produit
                  </button>
                </div>

                {selectedProduits.length === 0 ? (
                  <div className="no-products">
                    <FiPackage className="no-products-icon" />
                    <p>Aucun produit ajouté. Veuillez ajouter des produits à commander.</p>
                  </div>
                ) : (
                  <div className="produits-list">
                    <div className="product-header">
                      <span className="product-header-item">Produit</span>
                      <span className="product-header-item">Quantité</span>
                      <span className="product-header-item">Prix unitaire</span>
                      <span className="product-header-item">TVA</span>
                      <span className="product-header-item">Unité</span>
                      <span className="product-header-item"></span>
                    </div>

                    {selectedProduits.map((produit, index) => (
                      <div key={index} className="product-row">
                        <select
                          value={produit.produitId}
                          onChange={(e) => handleProductChange(index, "produitId", e.target.value)}
                          required
                          className="product-select animated-input"
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
                          className="quantity-input animated-input"
                          min="1"
                        />

                        <div className="price-input-container">
                          <FiDollarSign className="price-icon" />
                          <input
                            type="text"
                            value={produit.prixUnitaire}
                            onChange={(e) => handleProductChange(index, "prixUnitaire", e.target.value)}
                            placeholder="Prix unitaire"
                            required
                            className="price-input animated-input"
                          />
                        </div>

                        <div className="tva-display">
                          <FiPercent className="tva-icon" />
                          <span>{produit.tva || 0}%</span>
                        </div>

                        <div className="unite-display">
                          <span>{produit.unite || "KILOGRAMME"}</span>
                        </div>

                        <button type="button" onClick={() => handleRemoveProduct(index)} className="btn-remove">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedProduits.length > 0 && (
                  <div className="total-section">
                    <div className="total-label">Total (TTC):</div>
                    <div className="total-amount">{calculateTotal()} DA</div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className={`btn-submit ${loading ? "loading" : ""}`}>
                  {loading ? (
                    <>
                      <span className="loader"></span>
                      <span>Chargement...</span>
                    </>
                  ) : (
                    "Créer le bon de commande"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonDeCommande;

