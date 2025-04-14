"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  FiEdit,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiTag,
  FiUserCheck,
} from "react-icons/fi"
import Sidebar from "./Slidebar.jsx"
import "../css/UserList.css"

// Notification
function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="notification success">
      <FiCheckCircle className="notification-icon" />
      <span>{message}</span>
    </div>
  )
}

// Confirmation
function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <FiAlertTriangle className="popup-icon" />
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="popup-actions">
          <button className="cancel-button" onClick={onCancel}>
            <FiX /> Annuler
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            <FiCheckCircle /> Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

// Édition
function EditPopup({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...user })
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData({ ...user })
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nom) newErrors.nom = "Le nom est requis"
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis"
    if (!formData.username) newErrors.username = "Le nom d'utilisateur est requis"
    if (!formData.email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmPopup(true)
    }
  }

  const confirmUpdate = async () => {
    setLoading(true)
    try {
      await axios.put(`http://localhost:8000/api/update/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      onSave(formData)
    } catch (error) {
      console.error("Erreur mise à jour :", error)
      setErrors({ submit: "Problème lors de la mise à jour." })
    } finally {
      setLoading(false)
      setShowConfirmPopup(false)
    }
  }

  return (
    <div className="popup-overlay" onClick={(e) => e.target.className === "popup-overlay" && onCancel()}>
      <div className="popup">
        <h3>
          <FiEdit style={{ marginRight: "10px" }} /> Modifier l'utilisateur
        </h3>

        <div className="form-group">
          <div className="input-icon-wrapper">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
              className={errors.nom ? "input-error" : ""}
            />
          </div>
          {errors.nom && <div className="error-message">{errors.nom}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon-wrapper">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              className={errors.prenom ? "input-error" : ""}
            />
          </div>
          {errors.prenom && <div className="error-message">{errors.prenom}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon-wrapper">
            <FiTag className="input-icon" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nom d'utilisateur"
              className={errors.username ? "input-error" : ""}
            />
          </div>
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon-wrapper">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? "input-error" : ""}
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className="input-icon-wrapper">
            <FiUserCheck className="input-icon" />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="chefservice">Chef de service</option>
              <option value="admin">Admin</option>
              <option value="magasinier">Magasinier</option>
            </select>
          </div>
        </div>

        {errors.submit && <div className="error-message global-error">{errors.submit}</div>}

        <div className="popup-actions">
          <button className="save-button" onClick={handleSubmit} disabled={loading}>
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
          <button className="cancel-button" onClick={onCancel} disabled={loading}>
            <FiX /> Annuler
          </button>
        </div>
      </div>

      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup confirmation-popup">
            <FiAlertTriangle className="popup-icon" />
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment enregistrer ces modifications ?</p>
            <div className="popup-actions">
              <button className="cancel-button" onClick={() => setShowConfirmPopup(false)}>
                <FiX /> Annuler
              </button>
              <button className="save-button" onClick={confirmUpdate} disabled={loading}>
                {loading ? (
                  <>
                    <div className="loader"></div> Enregistrement...
                  </>
                ) : (
                  <>
                    <FiSave /> Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant principal
function UserList() {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [notification, setNotification] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        console.log("Tous les utilisateurs:", response.data)
        setUsers(response.data)
        const currentUser = JSON.parse(localStorage.getItem("user"))
        if (currentUser) setCurrentUserId(currentUser.id)
      } catch (error) {
        console.error("Erreur récupération utilisateurs :", error)
      }
    }
    fetchUsers()
  }, [])

  // Filtrer l'utilisateur actuel
  const allUsers = users.filter((user) => user.id !== currentUserId)

  const handleEdit = (user) => setEditUser(user)

  const handleDelete = (userId) => {
    setUserToDelete(userId)
    setShowPopup(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers(users.filter((user) => user.id !== userToDelete))
      setNotification("Utilisateur supprimé avec succès !")
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error)
    }
    setShowPopup(false)
  }

  const handleSaveEdit = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditUser(null)
    setNotification("L'utilisateur a été modifié avec succès !")
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        {/* Afficher tous les utilisateurs dans une seule liste */}
        <div className="table-container">
          <h1 className="table-title">Liste des Utilisateurs</h1>
          <table className="user-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td className={user.role === "admin" ? "user-role admin-role" : "user-role"}>{user.role}</td>
                    <td className="actions-cell">
                      <button className="edit-button" onClick={() => handleEdit(user)} title="Modifier">
                        <FiEdit />
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(user.id)} title="Supprimer">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-message">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {notification && <Notification message={notification} onClose={() => setNotification("")} />}

        {showPopup && (
          <ConfirmationPopup
            message="Une fois supprimé, vous ne pourrez pas récupérer cet utilisateur."
            onConfirm={confirmDelete}
            onCancel={() => setShowPopup(false)}
          />
        )}

        {editUser && <EditPopup user={editUser} onSave={handleSaveEdit} onCancel={() => setEditUser(null)} />}
      </div>
    </div>
  )
}

export default UserList
