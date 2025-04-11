import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import { FiUser, FiMail, FiLock, FiTag, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "../css/RegisterUser.css";

function RegisterUser() {
    const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !username || !email || !role || !password) {
      setMessage({ text: "Veuillez remplir tous les champs.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, username, email, role, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: "Utilisateur enregistré avec succès !", type: "success" });
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage({ text: data.message || "Une erreur est survenue.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Problème de connexion.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
          <div className="form-card">
            <div className="card-header">
              <FiUser className="card-icon" />
              <div>
                <h2 className="card-title">Créer un Utilisateur</h2>
                <p className="card-description">Ajoutez un nouvel utilisateur au système</p>
              </div>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? <FiAlertCircle className="message-icon" /> : <FiCheckCircle className="message-icon" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom"><FiUser className="input-icon" /> Nom :</label>
                  <input id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Nom" />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom"><FiUser className="input-icon" /> Prénom :</label>
                  <input id="prenom" type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required placeholder="Prénom" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username"><FiUser className="input-icon" /> Nom d&apos;utilisateur :</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nom d'utilisateur" />
              </div>

              <div className="form-group">
                <label htmlFor="email"><FiMail className="input-icon" /> Email :</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
              </div>

              <div className="form-group">
                <label htmlFor="role"><FiTag className="input-icon" /> Rôle :</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">Sélectionnez un rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="chefservice">Chef Service</option>
                  <option value="magasinier">Magasinier</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password"><FiLock className="input-icon" /> Mot de passe :</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mot de passe" />
              </div>

              <div className="form-actions">
                <button type="submit" className={`btn-submit ${loading ? "loading" : ""}`} disabled={loading}>
                  {loading ? <><span className="loader"></span> <span>Enregistrement...</span></> : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    
  );
};

export default RegisterUser;
