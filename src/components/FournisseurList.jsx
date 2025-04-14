"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "./Slidebar.jsx"
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiX } from "react-icons/fi"
import "../css/FournisseurList.css"

// Notification de succès
function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return <div className="notification">{message}</div>
}

// Formulaire de modification avec confirmation
function EditFournisseurPopup({ fournisseur, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...fournisseur })
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    setShowConfirmation(true) // Affiche la popup de confirmation
  }

  const confirmSubmit = async () => {
    setLoading(true)
    setShowConfirmation(false) // Ferme la popup de confirmation

    try {
      await axios.put(`http://localhost:8000/api/fournisseurs/${fournisseur.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      onSave(formData)
    } catch (error) {
      console.error("Erreur lors de la modification :", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="popup-overlay">
        <div className="popup">
          <h3>
            <FiEdit style={{ marginRight: "10px" }} /> Modifier le fournisseur
          </h3>

          <div className="input-icon-wrapper">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-icon-wrapper">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-icon-wrapper">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-icon-wrapper">
            <FiPhone className="input-icon" />
            <input
              type="text"
              name="num_telephone"
              placeholder="Téléphone"
              value={formData.num_telephone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-icon-wrapper">
            <FiMapPin className="input-icon" />
            <input
              type="text"
              name="adresse"
              placeholder="Adresse"
              value={formData.adresse}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="popup-actions">
            <button className="confirm-button" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <div className="loader"></div> Enregistrement...
                </>
              ) : (
                <>
                  <FiSave /> Enregistrer
                </>
              )}
            </button>
            <button className="cancel-button" onClick={onClose} disabled={loading}>
              <FiX /> Annuler
            </button>
          </div>
        </div>
      </div>

      {/* Popup de confirmation */}
      {showConfirmation && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment enregistrer ces modifications ?</p>
            <div className="popup-actions">
              <button className="cancel-button" onClick={() => setShowConfirmation(false)}>
                <FiX /> Annuler
              </button>
              <button className="confirm-button" onClick={confirmSubmit}>
                <FiSave /> Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Liste des fournisseurs
function FournisseurList() {
  const [fournisseurs, setFournisseurs] = useState([])
  const [selectedFournisseur, setSelectedFournisseur] = useState(null)
  const [notification, setNotification] = useState("")

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/fournisseurs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setFournisseurs(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération :", error)
      }
    }

    fetchFournisseurs()
  }, [])

  const handleEdit = (fournisseur) => {
    setSelectedFournisseur(fournisseur)
  }

  const handleSave = (updatedFournisseur) => {
    setFournisseurs((prev) => prev.map((f) => (f.id === updatedFournisseur.id ? updatedFournisseur : f)))
    setSelectedFournisseur(null)
    setNotification("Le fournisseur a été modifié avec succès !")
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="table-container">
          <h1 className="table-title">Liste des Fournisseurs</h1>

          <table className="fournisseur-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.id}>
                  <td>{fournisseur.nom}</td>
                  <td>{fournisseur.prenom}</td>
                  <td>{fournisseur.email}</td>
                  <td>{fournisseur.num_telephone}</td>
                  <td>{fournisseur.adresse}</td>
                  <td className="actions-cell">
                    <button className="edit-button" onClick={() => handleEdit(fournisseur)}>
                      <FiEdit />
                    </button>
                    <button className="delete-button">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notification */}
        {notification && <Notification message={notification} onClose={() => setNotification("")} />}

        {/* Popup d'édition */}
        {selectedFournisseur && (
          <EditFournisseurPopup
            fournisseur={selectedFournisseur}
            onClose={() => setSelectedFournisseur(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  )
}

export default FournisseurList
