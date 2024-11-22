import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";
import Sidebar from "../components/Slidebar.jsx";
import whatsappIcon from "../images/Whatsapp.png";
import gmailIcon from "../images/Gmail.png"; 
import "../css/ListeDesBonsDeCommande.css";

const ListeDesBonsDeCommande = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState([]); // Liste des bons de commande
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Pour afficher la popup
  const [selectedBonId, setSelectedBonId] = useState(null); // ID du bon sélectionné pour suppression

  useEffect(() => {
    const fetchBonsDeCommande = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdcm");
        setBonsDeCommande(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des bons de commande",
          error
        );
        setMessage("Erreur lors de la récupération des bons de commande");
      }
    };
    fetchBonsDeCommande();
  }, []);

  // Fonction pour supprimer un bon de commande
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/supr/bdcm/${id}`);
      setBonsDeCommande((prev) => prev.filter((bon) => bon.id !== id));
      alert("Bon de commande supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du bon de commande", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
    setShowConfirmPopup(false); // Ferme la popup après suppression
  };

  // Fonction pour ouvrir la popup de confirmation
  const openConfirmationPopup = (id) => {
    setSelectedBonId(id);
    setShowConfirmPopup(true);
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setShowConfirmPopup(false);
    setSelectedBonId(null);
  };

  // Fonction pour télécharger un bon de commande
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/bdcm/${id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bon_de_commande_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de commande", error);
      alert("Une erreur est survenue lors du téléchargement du fichier.");
    }
  };

// Fonction pour envoyer via WhatsApp
// Fonction pour envoyer via WhatsApp
const handleSendWhatsApp = (telephone, id) => {
  // Vérifie si le numéro commence par "0", c'est le cas des numéros algériens sans le code pays
  if (telephone.startsWith("0")) {
    telephone = `+213${telephone.slice(1)}`; // Remplace le "0" initial par le code pays +213
  }

  const pdfURL = `http://localhost:8000/api/bdcm/${id}/pdf`; // Lien vers le PDF du bon de commande
  const message = `Bonjour, voici le bon de commande: ${pdfURL}`; // Message avec le lien vers le PDF
  const whatsappURL = `https://wa.me/${telephone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};



  // Fonction pour envoyer via Gmail
  const handleSendGmail = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons de commande</h2>
        {message && <p className="error">{message}</p>}

        <table className="bons-table">
          <thead>
            <tr>
              <th>Code du bon</th>
              <th>Fournisseur</th>
              <th>Téléphone du fournisseur</th>
              <th>Actions</th>
              <th>Envoyer</th> {/* Nouvelle colonne */}
            </tr>
          </thead>
          <tbody>
            {bonsDeCommande.length > 0 ? (
              bonsDeCommande.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.code}</td>
                  <td>{bon.fournisseur.nom}</td>
                  <td>{bon.fournisseur.num_telephone}</td>
                  <td className="actions">
                    {/* Bouton pour supprimer */}
                    <button
                      className="delete-button"
                      onClick={() => openConfirmationPopup(bon.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 size={18} color="red" />
                    </button>

                    {/* Bouton pour télécharger */}
                    <button
                      className="download-button"
                      onClick={() => handleDownload(bon.id)}
                      title="Télécharger"
                    >  
                      <FiDownload size={18} color="green" />
                    </button>
                  </td>
                  <td className="send-icons">
                    {/* WhatsApp */}
                    <button
                      className="whatsapp-button"
                      onClick={() => handleSendWhatsApp(bon.fournisseur.num_telephone, bon.id)}
                      title="Envoyer via WhatsApp"
                    >
                      <img
                        src={whatsappIcon}
                        alt="WhatsApp"
                        className="icon"
                      />
                    </button>

                    {/* Gmail */}
                    <button
                      className="gmail-button"
                      onClick={() => handleSendGmail(bon.fournisseur.email)}
                      title="Envoyer via Gmail"
                    >
                      <img
                        src={gmailIcon}
                        alt="Gmail"
                        className="icon"
                      />
                    </button>
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

      {/* Popup de confirmation */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirmation</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce bon de commande ?</p>
            <div className="popup-actions">
              <button
                className="confirm-button"
                onClick={() => handleDelete(selectedBonId)}
              >
                Oui, supprimer
              </button>
              <button className="cancel-button" onClick={cancelDelete}>
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
