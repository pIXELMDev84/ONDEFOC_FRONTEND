import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import "../css/RegisterUser.css";

function RegisterFournisseur() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [numTelephone, setNumTelephone] = useState("");
    const [categorieId, setCategorieId] = useState(""); // Catégorie du fournisseur
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Nouveau message de succès
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Fournisseur enregistré avec succès !");
                setError("");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Numéro de téléphone"
                        value={numTelephone}
                        onChange={(e) => setNumTelephone(e.target.value)}
                        required
                    />
                    <select
                        value={categorieId}
                        onChange={(e) => setCategorieId(e.target.value)}
                        required
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {/* Remplir avec les catégories existantes */}
                        <option value="1">Catégorie 1</option>
                        <option value="2">Catégorie 2</option>
                        <option value="3">Catégorie 3</option>
                    </select>
                    <button type="submit">Enregistrer</button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterFournisseur;
