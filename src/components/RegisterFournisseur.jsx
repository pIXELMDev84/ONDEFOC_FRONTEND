"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiPhone, FiMapPin, FiTag, FiAlertCircle, FiCheckCircle, FiTruck } from "react-icons/fi"
import "../css/RegisterFournisseur.css";


// Importez votre sidebar existante - Correction du chemin d'importation
import Sidebar from "./Slidebar.jsx" // Notez que nous n'importons pas de CSS ici

const RegisterFournisseur = () => {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [numTelephone, setNumTelephone] = useState("")
  const [categorieId, setCategorieId] = useState("") // Catégorie sélectionnée
  const [adresse, setAdresse] = useState("") // Nouvel état pour l'adresse
  const [categories, setCategories] = useState([]) // Liste des catégories
  const [message, setMessage] = useState({ text: "", type: "" })
  const [loading, setLoading] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)

  const navigate = useNavigate()

  

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    // Ajouter une animation au chargement initial
    setAnimateForm(true)

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data) // Stocke les catégories dans le state
        } else {
          console.error("Erreur lors de la récupération des catégories.")
          setMessage({
            text: "Erreur lors de la récupération des catégories.",
            type: "error",
          })
        }
      } catch (error) {
        console.error("Erreur réseau :", error)
        setMessage({
          text: "Problème de connexion au serveur.",
          type: "error",
        })
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation basique
    if (!nom || !prenom || !email || !numTelephone || !adresse || !categorieId) {
      setMessage({
        text: "Veuillez remplir tous les champs du formulaire.",
        type: "error",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/fournisseurs/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          num_telephone: numTelephone,
          categorie_id: categorieId,
          adresse,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          text: "Fournisseur enregistré avec succès !",
          type: "success",
        })

        // Réinitialiser le formulaire
        setNom("")
        setPrenom("")
        setEmail("")
        setNumTelephone("")
        setCategorieId("")
        setAdresse("")

        // Redirection après un délai
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        setMessage({
          text: data.message || "Une erreur est survenue lors de l'enregistrement.",
          type: "error",
        })
      }
    } catch (error) {
      setMessage({
        text: "Une erreur s'est produite. Veuillez réessayer.",
        type: "error",
      })
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className={`fournisseur-container ${animateForm ? "animate-in" : ""}`}>
          <div className="fournisseur-card">
            <div className="card-header">
              <FiTruck className="card-icon" />
              <div>
                <h2 className="card-title">Enregistrer un Fournisseur</h2>
                <p className="card-description">Ajoutez un nouveau fournisseur dans le système</p>
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

            <form onSubmit={handleSubmit} className="fournisseur-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">
                    <FiUser className="input-icon" /> Nom :
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="animated-input"
                    placeholder="Nom du fournisseur"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">
                    <FiUser className="input-icon" /> Prénom :
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="animated-input"
                    placeholder="Prénom du fournisseur"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <FiMail className="input-icon" /> Email :
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="animated-input"
                    placeholder="Adresse email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numTelephone">
                    <FiPhone className="input-icon" /> Téléphone :
                  </label>
                  <input
                    id="numTelephone"
                    type="text"
                    value={numTelephone}
                    onChange={(e) => setNumTelephone(e.target.value)}
                    required
                    className="animated-input"
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="adresse">
                  <FiMapPin className="input-icon" /> Adresse :
                </label>
                <input
                  id="adresse"
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  required
                  className="animated-input"
                  placeholder="Adresse complète"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categorieId">
                  <FiTag className="input-icon" /> Catégorie :
                </label>
                <select
                  id="categorieId"
                  value={categorieId}
                  onChange={(e) => setCategorieId(e.target.value)}
                  required
                  className="animated-input"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                      {categorie.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className={`btn-submit ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loader"></span>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    "Enregistrer le fournisseur"
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

export default RegisterFournisseur;



