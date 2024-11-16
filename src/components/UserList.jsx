import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import des icônes
import "../css/UserList.css";

function Popup({ message, onConfirm, onCancel }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onConfirm}>
                        Oui
                    </button>
                    <button className="cancel-button" onClick={onCancel}>
                        Annuler
                    </button>
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
        console.log("Modifier l'utilisateur:", user);
        // Ajoutez ici la logique pour afficher un formulaire d'édition ou une popup
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

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Liste des Utilisateurs</h1>
                {showPopup && (
                    <Popup
                        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="user-name">{user.nom}</td>
                                <td>{user.prenom}</td>
                                <td className="user-email">{user.email}</td>
                                <td className="user-role">{user.role}</td>
                                <td className="user-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(user)}
                                        title="Modifier"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(user.id)}
                                        title="Supprimer"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserList;
