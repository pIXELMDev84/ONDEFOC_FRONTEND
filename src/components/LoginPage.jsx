import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import logo from "../images/LOGO-ONDEFOC.png";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Réponse:", data);

            if (response.ok) {
                if (rememberMe) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("token", data.token);
                } else {
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                    sessionStorage.setItem("token", data.token);
                }

                if (data.user.role === "admin") {
                    navigate("/dashboard");
                } else if (data.user.role === "chefservice") {
                    navigate("/dashboardUser");
                } else if (data.user.role === "magasinier") {
                    navigate("/dashboardMagasinier");
                } else {
                    setError("Rôle non reconnu.");
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
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Rester connecté</label>
                    </div>
                    <button className="loginbtn" type="submit">Se connecter</button>
                    {error && <p className="error-message">{error}</p>}
                    <p>
                        <a href="/forgot-password">Mot de passe oublié ?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
