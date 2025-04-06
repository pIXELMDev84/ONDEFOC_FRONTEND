import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import "../css/ListeDesBonsDeCommande.css";

const ListeDesBonsDeCommande = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBonId, setSelectedBonId] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login";
    } else {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role); // Stocker le rôle de l'utilisateur
    }

    const fetchBonsDeCommande = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdcm");
        setBonsDeCommande(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de commande", error);
        setMessage("Erreur lors de la récupération des bons de commande");
      }
    };
    fetchBonsDeCommande();
  }, []);

  // Suppression d'un bon de commande
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/supr/bdcm/${id}`);
      setBonsDeCommande((prev) => prev.filter((bon) => bon.id !== id));
      setMessage({ text: "Bon de commande supprimé avec succès.", type: "success" });
    } catch (error) {
      console.error("Erreur lors de la suppression du bon de commande", error);
      setMessage({ text: "Une erreur est survenue lors de la suppression.", type: "error" });
    }
    setShowConfirmPopup(false);
  };

  // Téléchargement du PDF d'un bon de commande
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bdcm/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bon_commande_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de commande", error);
      setMessage({ text: "Erreur lors du téléchargement.", type: "error" });
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons de commande</h2>

        {message && <div className={`notification ${message.type}`}>{message.text}</div>}

        <table className="bons-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Fournisseur</th>
              <th>Téléphone</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bonsDeCommande.length > 0 ? (
              bonsDeCommande.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.code}</td>
                  <td>{bon.fournisseur.nom}</td>
                  <td>{bon.fournisseur.num_telephone}</td>
                  <td>{new Date(bon.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="download-button" onClick={() => handleDownload(bon.id)}>
                      <FiDownload size={18} color="green" />
                    </button>
                    {userRole === "admin" && (
                      <button className="delete-button" onClick={() => setShowConfirmPopup(true)}>
                        <FiTrash2 size={18} color="red" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucun bon de commande trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pop-up de confirmation */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup confirm-popup">
            <h3>Confirmation</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce bon de commande ?</p>
            <div className="popup-actions">
              <button className="confirm-button" onClick={() => handleDelete(selectedBonId)}>
                Oui, supprimer
              </button>
              <button className="cancel-button" onClick={() => setShowConfirmPopup(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeDesBonsDeCommande;
