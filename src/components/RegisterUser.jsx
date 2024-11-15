import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import "../css/RegisterUser.css";

function RegisterUser() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    username,
                    email,
                    role,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/dashboard");
            } else {
                setError(data.message || "Une erreur est survenue lors de l'enregistrement.");
            }
        } catch (error) {
            setError("Une erreur s'est produite. Veuillez réessayer.");
            console.error("Erreur:", error);
        }
    };

    return (
        <div className="dashboard"> {/* Dashboard container with sidebar and main content */}
            <Sidebar /> {/* Sidebar component */}
            <div className="main-content"> {/* Main content area */}
                <h1>Enregistrer un Nouvel Utilisateur</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                        <option value="chefservice">Chef Service</option>
                        <option value="magasinier">Magasinier</option>
                    </select>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Enregistrer</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterUser;
