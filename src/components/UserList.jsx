import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
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

    const filteredUsers = users.filter(user => user.id !== currentUserId);

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Liste des Utilisateurs</h1>
                <ul className="user-list">
                    {filteredUsers.map(user => (
                        <li key={user.id} className="user-item">
                            <span className="user-name">{user.nom} {user.prenom}</span>
                            <span className="user-email">{user.email}</span>
                            <span className="user-role">{user.role}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserList;
