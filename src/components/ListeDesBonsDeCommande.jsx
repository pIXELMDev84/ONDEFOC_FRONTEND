import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import whatsappIcon from "../images/Whatsapp.png";
import gmailIcon from "../images/Gmail.png";
import "../css/ListeDesBonsDeCommande.css";

const ListeDesBonsDeCommande = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState([]);
  const [filteredBons, setFilteredBons] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBonId, setSelectedBonId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBonsDeCommande = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/abdcm");
        setBonsDeCommande(response.data);
        setFilteredBons(response.data); // Initial filtering with all data
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de commande", error);
        setMessage("Erreur lors de la récupération des bons de commande");
      }
    };
    fetchBonsDeCommande();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredBons(bonsDeCommande); // Show all if search is cleared
    } else {
      const filtered = bonsDeCommande.filter((bon) => {
        const { code, fournisseur, created_at } = bon;
        return (
          code.toLowerCase().includes(term) ||
          fournisseur.nom.toLowerCase().includes(term) ||
          new Date(created_at).toLocaleDateString().includes(term)
        );
      });
      setFilteredBons(filtered);
    }
  };

  const handleUpdateEtat = async (id, newEtat) => {
    try {
      await axios.put(`http://localhost:8000/api/bdcm/${id}/etat`, {
        etat: newEtat,
      });
      setBonsDeCommande((prev) =>
        prev.map((bon) => (bon.id === id ? { ...bon, etat: newEtat } : bon))
      );
      setMessage({ text: "L'état du bon de commande a été mis à jour.", type: "success" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état", error);
      setMessage({ text: "Une erreur est survenue lors de la mise à jour de l'état.", type: "error" });
    }
  };

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

  const openConfirmationPopup = (id) => {
    setSelectedBonId(id);
    setShowConfirmPopup(true);
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false);
    setSelectedBonId(null);
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/bdcm/${id}/pdf`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bon_de_commande_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage({ text: "Téléchargement réussi.", type: "success" });
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de commande", error);
      setMessage({ text: "Une erreur est survenue lors du téléchargement du fichier.", type: "error" });
    }
  };

  const handleSendWhatsApp = (telephone, id) => {
    if (telephone.startsWith("0")) {
      telephone = `+213${telephone.slice(1)}`;
    }
    const pdfURL = `http://localhost:8000/api/bdcm/${id}/pdf`;
    const message = `Bonjour, voici le bon de commande : ${pdfURL}`;
    const whatsappURL = `https://wa.me/${telephone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  const handleSendGmail = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons de commande</h2>

        <input
          type="text"
          placeholder="Rechercher par code, fournisseur ou date"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <table className="bons-table">
          <thead>
            <tr>
              <th>Code du bon</th>
              <th>Fournisseur</th>
              <th>Téléphone du fournisseur</th>
              <th>Actions</th>
              <th>Envoyer</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {filteredBons.length > 0 ? (
              filteredBons.map((bon) => (
                <tr key={bon.id} className={bon.etat === "validé" ? "validated-row" : ""}>
                  <td>{bon.code}</td>
                  <td>{bon.fournisseur.nom}</td>
                  <td>{bon.fournisseur.num_telephone}</td>
                  <td className="actions">
                    <button
                      className="delete-button"
                      onClick={() => openConfirmationPopup(bon.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 size={18} color="red" />
                    </button>
                    <button
                      className="download-button"
                      onClick={() => handleDownload(bon.id)}
                      title="Télécharger"
                    >
                      <FiDownload size={18} color="green" />
                    </button>
                  </td>
                  <td className="send-icons">
                    <button
                      className="whatsapp-button"
                      onClick={() =>
                        handleSendWhatsApp(bon.fournisseur.num_telephone, bon.id)
                      }
                      title="Envoyer via WhatsApp"
                    >
                      <img src={whatsappIcon} alt="WhatsApp" className="icon" />
                    </button>
                    <button
                      className="gmail-button"
                      onClick={() => handleSendGmail(bon.fournisseur.email)}
                      title="Envoyer via Gmail"
                    >
                      <img src={gmailIcon} alt="Gmail" className="icon" />
                    </button>
                  </td>
                  <td>
                    {bon.etat !== "validé" ? (
                      <select
                        value={bon.etat}
                        onChange={(e) => handleUpdateEtat(bon.id, e.target.value)}
                      >
                        <option value="En attente">En attente</option>
                        <option value="validé" className="validated-option">
                          validé
                        </option>
                      </select>
                    ) : (
                      <span className="validated-text">Validé</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Aucun bon de commande trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
