import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "../css/UserList.css";

function Popup({ message, onConfirm, onCancel }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onConfirm}>Oui</button>
                    <button className="cancel-button" onClick={onCancel}>Annuler</button>
                </div>
            </div>
        </div>
    );
}

function EditPopup({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({ ...user, password: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/update/users/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setSuccessMessage("Utilisateur modifié avec succès !");
            setTimeout(() => setSuccessMessage(""), 3000);
            onSave(formData);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            alert("Une erreur s'est produite lors de la mise à jour.");
        }
        setLoading(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Modifier l'utilisateur</h3>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <input className="custom-input" type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" disabled={loading} />
                <input className="custom-input" type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" disabled={loading} />
                <input className="custom-input" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'utilisateur" disabled={loading} />
                <input className="custom-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" disabled={loading} />
                <input className="custom-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nouveau mot de passe" disabled={loading} />
                <select className="custom-input" name="role" value={formData.role} onChange={handleChange} disabled={loading}>
                    <option value="chefservice">Chef de service</option>
                    <option value="admin">Admin</option>
                    <option value="magasinier">Magasinier</option>
                </select>
                <div className="popup-actions">
                    <button className="save-button" onClick={handleSubmit} disabled={loading}>
                        {loading ? <span className="loader"></span> : "Enregistrer"}
                    </button>
                    <button className="cancel-button" onClick={onCancel} disabled={loading}>Annuler</button>
                </div>
            </div>
        </div>
    );
}

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => user.id !== currentUserId);

    const handleEdit = (user) => {
        setEditUser(user);
    };

    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${userToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(users.filter((user) => user.id !== userToDelete));
            alert("Utilisateur supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error);
            alert("Une erreur s'est produite lors de la suppression.");
        }
        setShowPopup(false);
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const handleSaveEdit = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setEditUser(null);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Liste des Utilisateurs</h1>
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
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.nom}</td>
                                <td>{user.prenom}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                <button className="edit-button" onClick={() => handleEdit(user)} title="Modifier">
                                        <FiEdit />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(user.id)} title="Supprimer">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showPopup && <Popup message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?" onConfirm={confirmDelete} onCancel={cancelDelete} />}
                {editUser && <EditPopup user={editUser} onSave={handleSaveEdit} onCancel={() => setEditUser(null)} />}
            </div>
        </div>
    );
}

export default UserList;
