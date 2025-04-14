import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import "../css/ListeDesBonJournalier.css";

const ListeDesBonJournalier = () => {
  const [bonsJournaliers, setBonsJournaliers] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBonId, setSelectedBonId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Fonction pour récupérer le rôle utilisateur, peu importe la source
  const fetchUserRole = async () => {
    try {
      // Étape 1 : Vérifiez localStorage ou sessionStorage
      const userData =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.role) {
          setUserRole(user.role);
          return;
        }
      }

      // Étape 2 : Si aucune donnée locale, faites une requête API
      const response = await axios.get("http://localhost:8000/api/current-user");
      if (response.data && response.data.role) {
        setUserRole(response.data.role);

        // Facultatif : stockez les données dans sessionStorage pour une utilisation future
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle utilisateur", error);
      setMessage({
        text: "Impossible de récupérer le rôle utilisateur.",
        type: "error",
      });
    }
  };

  // Fonction pour récupérer les bons journaliers
  const fetchBonsJournaliers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bons-journaliers");
      setBonsJournaliers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bons journaliers", error);
      setMessage({
        text: "Erreur lors de la récupération des bons journaliers",
        type: "error",
      });
    }
  };

  // Appels initiaux pour récupérer les données
  useEffect(() => {
    fetchUserRole();
    fetchBonsJournaliers();
  }, []);

  // Ouverture de la popup de confirmation pour suppression
  const openConfirmationPopup = (id) => {
    setSelectedBonId(id);
    setShowConfirmPopup(true);
  };

  // Fonction pour supprimer un bon journalier
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/bons-journaliers/${id}`);
      setBonsJournaliers((prev) => prev.filter((bon) => bon.id !== id));
      setMessage({
        text: "Bon journalier supprimé avec succès.",
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du bon journalier", error);
      setMessage({
        text: "Une erreur est survenue lors de la suppression.",
        type: "error",
      });
    }
    setShowConfirmPopup(false);
  };

  // Fonction pour télécharger un bon journalier
  const handleDownload = async (id) => {
    window.open(`http://localhost:8000/api/bons-journaliers/${id}`, "_blank");
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons journaliers</h2>

        {message && (
          <div className={`notification ${message.type}`}>{message.text}</div>
        )}

        <table className="bons-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bonsJournaliers.length > 0 ? (
              bonsJournaliers.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.code}</td>
                  <td>{new Date(bon.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="download-button"
                      onClick={() => handleDownload(bon.id)}
                    >
                      <FiDownload size={18} color="green" />
                    </button>
                    {userRole === "admin" && (
                      <button
                        className="delete-button"
                        onClick={() => openConfirmationPopup(bon.id)}
                      >
                        <FiTrash2 size={18} color="red" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucun bon journalier trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirmation</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce bon journalier ?</p>
            <div className="popup-actions">
              <button
                className="confirm-button"
                onClick={() => handleDelete(selectedBonId)}
              >
                Oui, supprimer
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowConfirmPopup(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeDesBonJournalier;