import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import "../css/UserList.css";

function Notification({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Disparaît après 3 secondes
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification success">
            <FiCheckCircle className="notification-icon" />
            <span>{message}</span>
        </div>
    );
}

function ConfirmationPopup({ message, onConfirm, onCancel }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <FiAlertTriangle className="popup-icon" />
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="cancel-button" onClick={onCancel}>Annuler</button>
                    <button className="confirm-button" onClick={onConfirm}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

function EditPopup({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({ ...user });
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setShowConfirmPopup(true); // Afficher la popup de confirmation
    };

    const confirmUpdate = async () => {
        try {
            await axios.put(`http://localhost:8000/api/update/users/${user.id}`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            onSave(formData);
        } catch (error) {
            console.error("Erreur mise à jour :", error);
            alert("Problème lors de la mise à jour.");
        }
        setShowConfirmPopup(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Modifier l'utilisateur</h3>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'utilisateur" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="chefservice">Chef de service</option>
                    <option value="admin">Admin</option>
                    <option value="magasinier">Magasinier</option>
                </select>
                <div className="popup-actions">
                    <button className="save-button" onClick={handleSubmit}>Enregistrer</button>
                    <button className="cancel-button" onClick={onCancel}>Annuler</button>
                </div>
            </div>
            {showConfirmPopup && (
                <ConfirmationPopup
                    message="Voulez-vous vraiment enregistrer ces modifications ?"
                    onConfirm={confirmUpdate}
                    onCancel={() => setShowConfirmPopup(false)}
                />
            )}
        </div>
    );
}

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur récupération utilisateurs :", error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => user.id !== currentUserId);

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
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsers(users.filter(user => user.id !== userToDelete));
            setNotification("Utilisateur supprimé avec succès !");
        } catch (error) {
            console.error("Erreur suppression utilisateur :", error);
        }
        setShowPopup(false);
    };

    const handleSaveEdit = (updatedUser) => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        setEditUser(null);
        setNotification("L'utilisateur a été modifié avec succès !");
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Liste des Utilisateurs</h1>
                {notification && <Notification message={notification} onClose={() => setNotification("")} />}
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
                {showPopup && (
                    <ConfirmationPopup
                        message="Une fois supprimé, vous ne pourrez pas récupérer cet utilisateur."
                        onConfirm={confirmDelete}
                        onCancel={() => setShowPopup(false)}
                    />
                )}
                {editUser && (
                    <EditPopup
                        user={editUser}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditUser(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default UserList;
