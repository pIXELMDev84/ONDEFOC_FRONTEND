import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import "../css/ListeDesBonsDeReception.css";

const ListeDesBonsDeReception = () => {
  const [bonsDeReception, setBonsDeReception] = useState([]);
  const [filteredBons, setFilteredBons] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBonId, setSelectedBonId] = useState(null);
  const [userRole, setUserRole] = useState(null);

const fetchBonsDeReception = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdrs");
        setBonsDeReception(response.data);
        setFilteredBons(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de réception", error);
        setMessage("Erreur lors de la récupération des bons de réception");
      }
    };
    fetchBonsDeReception();


  // Fonction pour ouvrir le popup de confirmation de suppression
  const openConfirmationPopup = (id) => {
    setSelectedBonId(id);
    setShowConfirmPopup(true);
  };

  // Fonction pour supprimer un bon de réception
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/supr/bdrs/${id}`);
      setBonsDeReception((prev) => prev.filter((bon) => bon.id !== id));
      setMessage({ text: "Bon de réception supprimé avec succès.", type: "success" });
    } catch (error) {
      console.error("Erreur lors de la suppression du bon de réception", error);
      setMessage({ text: "Une erreur est survenue lors de la suppression.", type: "error" });
    }
    setShowConfirmPopup(false);
  };

  // Fonction pour télécharger le PDF d'un bon de réception
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bdrs/${id}/pdf`, {
        responseType: "blob", // Important pour récupérer un fichier
      });

      // Création d'un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bon_reception_${id}.pdf`); // Nom du fichier
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de réception", error);
      setMessage({ text: "Erreur lors du téléchargement.", type: "error" });
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons de réception</h2>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <table className="bons-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Fournisseur</th>
              <th>Téléphone</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBons.length > 0 ? (
              filteredBons.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.code}</td>
                  <td>{bon.fournisseur.nom}</td>
                  <td>{bon.fournisseur.num_telephone}</td>
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
                <td colSpan="5">Aucun bon de réception trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirmation</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce bon de réception ?</p>
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

export default ListeDesBonsDeReception;
