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

  const fetchBonsJournaliers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/bons-journaliers");
        setBonsJournaliers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bons journaliers", error);
        setMessage("Erreur lors de la récupération des bons journaliers");
      }
    };
    fetchBonsJournaliers();


  const openConfirmationPopup = (id) => {
    setSelectedBonId(id);
    setShowConfirmPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/bons-journaliers/${id}`);
      setBonsJournaliers((prev) => prev.filter((bon) => bon.id !== id));
      setMessage({ text: "Bon journalier supprimé avec succès.", type: "success" });
    } catch (error) {
      console.error("Erreur lors de la suppression du bon journalier", error);
      setMessage({ text: "Une erreur est survenue lors de la suppression.", type: "error" });
    }
    setShowConfirmPopup(false);
  };

  const handleDownload = async (id) => {
    window.open(`http://localhost:8000/api/bons-journaliers/${id}`, "_blank");
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons journaliers</h2>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
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
                    {userRole === "admin" && (
                      <button
                        className="delete-button"
                        onClick={() => openConfirmationPopup(bon.id)}
                      >
                        <FiTrash2 size={18} color="red" />
                      </button>
                    )}
                    <button
                      className="download-button"
                      onClick={() => handleDownload(bon.id)}
                    >
                      <FiDownload size={18} color="green" />
                    </button>
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

export default ListeDesBonJournalier;
