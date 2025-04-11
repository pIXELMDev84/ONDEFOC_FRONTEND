"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "./Slidebar.jsx"
import "../css/AjouterProduit.css"
import { Package, Percent, Ruler, FolderTree } from "lucide-react"

const AjouterProduit = () => {
  // États pour les champs du formulaire
  const [nom, setNom] = useState("")
  const [tva, setTva] = useState(0)
  const [uniteMesure, setUniteMesure] = useState("UNITE")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const unites = ["BIDON", "BOITE", "BOT", "BOUTEILLES", "KILOGRAMME", "PAQUETS", "PLATEAU", "POT", "UNITE"]

  // Charger les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories")
        setCategories(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!nom || !categoryId) {
      setMessage("Veuillez remplir tous les champs.")
      return
    }

    const data = {
      nom: nom.trim(),
      tva: Number.parseFloat(tva),
      unite_mesure: uniteMesure,
      categories_id: Number.parseInt(categoryId),
    }

    setLoading(true)

    try {
      const response = await axios.post("http://localhost:8000/api/produits/add", data)
      setMessage("Produit ajouté avec succès.")
      console.log(response.data)

      // Réinitialisation des champs
      setNom("")
      setTva(0)
      setUniteMesure("UNITE")
      setCategoryId("")
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error.response ? error.response.data : error)
      setMessage("Erreur lors de l'ajout du produit.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="form-wrapper">
          <div className="form-header">
            <div className="form-icon">
              <Package className="icon" />
            </div>
            <div>
              <h2>Ajouter un Produit</h2>
              <p>Ajoutez un nouveau produit au système</p>
            </div>
          </div>

          {message && <div className={`message ${message.includes("Erreur") ? "error" : "success"}`}>{message}</div>}

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <Package size={18} />
                Nom du produit :
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom du produit"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Percent size={18} />
                TVA (%) :
              </label>
              <input
                type="number"
                value={tva}
                onChange={(e) => setTva(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Ruler size={18} />
                Unité de mesure :
              </label>
              <select value={uniteMesure} onChange={(e) => setUniteMesure(e.target.value)} required>
                {unites.map((u, index) => (
                  <option key={index} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <FolderTree size={18} />
                Catégorie :
              </label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              Enregistrer
            </button>
          </form>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AjouterProduit
