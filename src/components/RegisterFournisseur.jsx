import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import "../css/RegisterUser.css";

function RegisterFournisseur() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Nouvel état pour le message de succès
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
                setSuccess("Utilisateur enregistré avec succès !");
                setError("");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000); // Redirige après 2 secondes
            } else {
                setError(data.message || "Une erreur est survenue lors de l'enregistrement.");
                setSuccess("");
            }
        } catch (error) {
            setError("Une erreur s'est produite. Veuillez réessayer.");
            setSuccess("");
            console.error("Erreur:", error);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Enregistrer un Nouveau Fournisseur</h1>
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
                        <option value="user">Cuisinier</option>
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
                    {success && <p className="success-message">{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterFournisseur;
