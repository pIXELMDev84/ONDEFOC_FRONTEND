import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import logo from "../images/LOGO-ONDEFOC.png";
import { FaInstagram } from "react-icons/fa";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [success, setSuccess] = useState("");
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login"); // Redirige si pas connecté
        }
    }, [navigate]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login"); // Redirige si pas connecté
        }
    
        drawParticles();

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
    
        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setSuccess("✅ Connexion réussie !");
                setTimeout(() => {
                    if (rememberMe) {
                        // Si l'utilisateur coche "Rester connecté", on utilise localStorage
                        localStorage.setItem("user", JSON.stringify(data.user));
                        localStorage.setItem("token", data.token);
                    } else {
                        // Sinon, on utilise sessionStorage (effacé dès que l'utilisateur ferme l'onglet)
                        sessionStorage.setItem("user", JSON.stringify(data.user));
                        sessionStorage.setItem("token", data.token);
                    }
    
                    // Redirection dynamique selon le rôle
                    switch (data.user.role) {
                        case "admin":
                            navigate("/dashboard");
                            break;
                        case "chefservice":
                            navigate("/dashboardchef");
                            break;
                        case "magasinier":
                            navigate("/dashboardMagasinier");
                            break;
                        default:
                            navigate("/login"); // Si le rôle n'est pas reconnu, rediriger vers login
                    }
                }, 1500);
            } else {
                setError(data.message || "❌ Une erreur est survenue !");
            }
        } catch (err) {
            setError("❌ Impossible de contacter le serveur !");
        }
    
        setLoading(false);
    };
    

    const drawParticles = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray = [];

        ctx.fillStyle = "#82354b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.02;
            }
            draw() {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        function createParticles() {
            for (let i = 0; i < 100; i++) {
                particlesArray.push(new Particle());
            }
        }
        createParticles();

        function animateParticles() {
            ctx.fillStyle = "#82354b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach((particle, index) => {
                particle.update();
                particle.draw();
                if (particle.size <= 0.2) {
                    particlesArray.splice(index, 1);
                    particlesArray.push(new Particle());
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    };

    return (
        <div className="login-container">
            <canvas ref={canvasRef} className="background-canvas"></canvas>
            <div className="login-box">
                <img src={logo} alt="Logo" className="login-logo" />
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                        />
                        <label htmlFor="rememberMe">
                            <span className="custom-checkbox"></span>
                            Rester connecté
                        </label>
                    </div>

                    <button className="loginbtn" type="submit" disabled={loading}>
                        {loading ? <div className="loader"></div> : "Se connecter"}
                    </button>
                    {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                    {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
                    {loading && <p style={{ color: "blue", marginTop: "10px" }}>Connexion en cours...</p>}

                    <a href="/forgot-password" className="forgot-password">
                        Mot de passe oublié ?
                    </a>
                </form>
            </div>
            <div className="footer-info">
    <div className="copyright">
        © {new Date().getFullYear()} ONDEFOC
    </div>
    <div className="developer-credit">
        Développé par{" "}
        <a href="https://www.instagram.com/aminesidiboumedine?igsh=dnQ0a29lMTR4YjRi&utm_source=qr" target="_blank" rel="noopener noreferrer">
            Sidiboumedine AbdelHak Amine
        </a>{" "}
        &{" "}
        <a href="https://www.instagram.com/sidali_brb?igsh=MTJrNXdxd3RiNTU1Yg==" target="_blank" rel="noopener noreferrer">
            Bourbala_Sidali
        </a>
    </div>
</div>
    </div>
  );
};

export default LoginPage;
