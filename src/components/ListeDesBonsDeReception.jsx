import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload, FiSearch } from "react-icons/fi";
import Sidebar from "./Slidebar.jsx";
import "../css/ListeDesBonsDeReception.css";

const ListeDesBonsDeReception = () => {
  const [bonsDeReception, setBonsDeReception] = useState([]);
  const [filteredBons, setFilteredBons] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false); // Pop-up de filtre
  const [selectedBonId, setSelectedBonId] = useState(null);
  const [filters, setFilters] = useState({
    code: "",
    fournisseur: "",
    dateDebut: "",
    dateFin: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login";
    } else {
      console.log("Utilisateur connecté :", JSON.parse(user));
    }

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
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    if (term === "") {
      setFilteredBons(bonsDeReception);
    } else {
      const filtered = bonsDeReception.filter((bon) => {
        const { code, fournisseur, date, created_at } = bon;
        return (
          code.toLowerCase().includes(term) ||
          fournisseur.nom.toLowerCase().includes(term) ||
          new Date(date).toLocaleDateString().includes(term) ||
          new Date(created_at).toLocaleDateString().includes(term)
        );
      });
      setFilteredBons(filtered);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const filtered = bonsDeReception.filter((bon) => {
      const { code, fournisseur, created_at } = bon;
      const createdDate = new Date(created_at);
      const startDate = filters.dateDebut ? new Date(filters.dateDebut) : null;
      const endDate = filters.dateFin ? new Date(filters.dateFin) : null;

      return (
        (filters.code === "" || code.toLowerCase().includes(filters.code.toLowerCase())) &&
        (filters.fournisseur === "" || fournisseur.nom.toLowerCase().includes(filters.fournisseur.toLowerCase())) &&
        (!startDate || createdDate >= startDate) &&
        (!endDate || createdDate <= endDate)
      );
    });
    setFilteredBons(filtered);
    setShowFilterPopup(false); // Ferme la pop-up après application du filtre
  };

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
        `http://localhost:8000/api/bdrs/${id}/pdf`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bon_de_reception_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage({ text: "Téléchargement réussi.", type: "success" });
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de réception", error);
      setMessage({ text: "Une erreur est survenue lors du téléchargement.", type: "error" });
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="list-container">
        <h2>Liste des bons de réception</h2>
        
        {/* Bouton pour ouvrir la pop-up de filtre */}
        <button
          className="filter-button"
          onClick={() => setShowFilterPopup(true)}
        >
          <FiSearch size={18} color="white" /> Recherche filtrée
        </button>

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
                    <button
                      className="delete-button"
                      onClick={() => openConfirmationPopup(bon.id)}
                    >
                      <FiTrash2 size={18} color="red" />
                    </button>
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

      {/* Pop-up de confirmation */}
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
              <button className="cancel-button" onClick={cancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up de filtrage */}
      {showFilterPopup && (
        <div className="popup-overlay">
          <div className="popup filter-popup">
            <h3>Recherche filtrée</h3>
            <div className="filter-group">
              <label>Code :</label>
              <input
                type="text"
                name="code"
                value={filters.code}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Fournisseur :</label>
              <input
                type="text"
                name="fournisseur"
                value={filters.fournisseur}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Date :</label>
              <input
                type="date"
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
              />
            </div>
            <div className="popup-actions">
              <button className="apply-button" onClick={applyFilters}>
                Appliquer
              </button>
              <button className="reset-button" onClick={() => setFilters({ code: "", fournisseur: "", dateDebut: "", dateFin: "" })}>
                Réinitialiser
              </button>
              <button
                className="close-button"
                onClick={() => setShowFilterPopup(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeDesBonsDeReception;
