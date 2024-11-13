import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import logo from "../images/LOGO-ONDEFOC.png";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // État pour le message d'erreur
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/dashboard"); // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Réponse:", data);

            if (response.ok) {
                // Stocker les informations de l'utilisateur
                localStorage.setItem("user", JSON.stringify(data.user));

                // Rediriger en fonction du rôle de l'utilisateur
                if (data.user && data.user.role === "admin") {
                    navigate("/dashboard");
                } else if (data.user && data.user.role === "user") {
                    navigate("/dashboardUser");
                } else {
                    setError("Rôle non reconnu."); // En cas de rôle inconnu
                }
            } else {
                setError(data.message || "Nom d'utilisateur ou mot de passe incorrect");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logo} alt="Logo" className="login-logo" />
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Se connecter</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
