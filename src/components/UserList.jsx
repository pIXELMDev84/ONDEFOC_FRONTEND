import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiEdit } from "react-icons/fi"; // Import de l'icône
import "../css/UserList.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

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
