"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle, FiTruck, FiPackage, FiCalendar } from "react-icons/fi"
import "../css/BonDeReception.css"

import Sidebar from "./Slidebar"

const BonDeReception = () => {
  const [bonCommandeId, setBonCommandeId] = useState("")
  const [bonsDeCommande, setBonsDeCommande] = useState([])
  const [fournisseurId, setFournisseurId] = useState("")
  const [fournisseurs, setFournisseurs] = useState([])
  const [produitsDisponibles, setProduitsDisponibles] = useState([])
  const [selectedProduits, setSelectedProduits] = useState([])
  const [date, setDate] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const [loading, setLoading] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)

  useEffect(() => {
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
    const fetchBonsDeCommande = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdcm")
        setBonsDeCommande(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de commande", error)
        setMessage({
          text: "Erreur lors de la récupération des bons de commande",
          type: "error",
        })
      }
    }
    fetchBonsDeCommande()
  }, [])

  const handleBonCommandeChange = async (id) => {
    setBonCommandeId(id)
    if (id) {
      try {
        const response = await axios.get(`http://localhost:8000/api/bondecommande/${id}/produits`)
        setProduitsDisponibles(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des produits", error)
        setProduitsDisponibles([])
        setMessage({
          text: "Erreur lors de la récupération des produits",
          type: "error",
        })
      }
    } else {
      setProduitsDisponibles([])
    }
  }

  const handleAddProduct = () => {
    setSelectedProduits([...selectedProduits, { produit_id: "", quantite_recu: 1 }])
  }

  const handleRemoveProduct = (index) => {
    const updatedProduits = [...selectedProduits]
    updatedProduits.splice(index, 1)
    setSelectedProduits(updatedProduits)
  }

  const handleProductChange = (index, field, value) => {
    const updatedProduits = [...selectedProduits]
    updatedProduits[index][field] = value
    setSelectedProduits(updatedProduits)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!bonCommandeId || !fournisseurId || selectedProduits.length === 0 || !date) {
      setMessage({
        text: "Veuillez remplir tous les champs correctement.",
        type: "error",
      });
      return;
    }
  
    const data = {
      bon_commande_id: Number.parseInt(bonCommandeId),
      fournisseur_id: Number.parseInt(fournisseurId),
      date: date,
      produits: selectedProduits.map((produit) => ({
        produit_id: Number.parseInt(produit.produit_id),
        quantite_recu: Number.parseInt(produit.quantite_recu),
      })),
    };
  
    console.log("Données envoyées au serveur :", data); // Debugging
  
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/bdrs", data);
      setMessage({
        text: "Bon de réception créé avec succès.",
        type: "success",
      });
      setSelectedProduits([]);
      setBonCommandeId("");
      setFournisseurId("");
      setDate("");
    } catch (error) {
      console.error("Erreur lors de la création du bon de réception", error);
      setMessage({
        text: "Erreur lors de la création du bon de réception.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className={`bon-reception-container ${animateForm ? "animate-in" : ""}`}>
          <div className="bon-reception-card">
            <div className="card-header">
              <FiTruck className="card-icon" />
              <div>
                <h2 className="card-title">Créer un bon de réception</h2>
                <p className="card-description">Enregistrez les produits reçus pour un bon de commande</p>
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

            <form onSubmit={handleSubmit} className="bon-reception-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bonCommande">Bon de commande :</label>
                  <select
                    id="bonCommande"
                    value={bonCommandeId}
                    onChange={(e) => handleBonCommandeChange(e.target.value)}
                    required
                    className="animated-input"
                  >
                    <option value="">Sélectionner un bon de commande</option>
                    {bonsDeCommande.map((bon) => (
                      <option key={bon.id} value={bon.id}>{`Bon #${bon.id}`}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fournisseur">Fournisseur :</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="date" className="date-label">
                  <FiCalendar className="date-icon" /> Date :
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

              <div className="produits-section">
                <div className="produits-header">
                  <h3>Produits reçus</h3>
                  <button type="button" className="btn-add-product" onClick={handleAddProduct}>
                    <FiPlus /> Ajouter un produit
                  </button>
                </div>

                {selectedProduits.length === 0 && (
                  <div className="no-products">
                    <FiPackage className="no-products-icon" />
                    <p>Aucun produit sélectionné. Cliquez sur "Ajouter un produit" pour commencer.</p>
                  </div>
                )}

                <div className="produits-list">
                  {selectedProduits.map((produit, index) => (
                    <div key={index} className="product-row">
                      <select
                        value={produit.produit_id}
                        onChange={(e) => handleProductChange(index, "produit_id", e.target.value)}
                        required
                        className="product-select animated-input"
                      >
                        <option value="">Sélectionner un produit</option>
                        {produitsDisponibles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nom}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Quantité"
                        value={produit.quantite_recu}
                        onChange={(e) => handleProductChange(index, "quantite_recu", e.target.value)}
                        required
                        min="1"
                        className="quantity-input animated-input"
                      />

                      <button type="button" onClick={() => handleRemoveProduct(index)} className="btn-remove">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className={`btn-submit ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loader"></span>
                      <span>Chargement...</span>
                    </>
                  ) : (
                    "Créer le bon de réception"
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

export default BonDeReception;

