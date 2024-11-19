import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiDownload } from "react-icons/fi"; // Import des icônes nécessaires
import Sidebar from "../components/Slidebar.jsx";
import "../css/ListeDesBonsDeCommande.css";

const ListeDesBonsDeCommande = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState([]); // Liste des bons de commande
  const [message, setMessage] = useState("");

  // Fonction pour récupérer les bons de commande depuis le backend
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
      await axios.delete(`http://localhost:8000/api/abdcm/${id}`);
      setBonsDeCommande((prev) => prev.filter((bon) => bon.id !== id));
      alert("Bon de commande supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du bon de commande", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  // Fonction pour télécharger un bon de commande
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/bdcm/${id}/pdf`,
        {
          responseType: "blob", // Important pour les fichiers binaires
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173", // Ajoute cet en-tête CORS
          }
        }
      );
  
      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bon_de_commande_${id}.pdf`); // Nom du fichier
      document.body.appendChild(link);
      link.click();
      link.remove(); // Nettoyer le DOM après le téléchargement
    } catch (error) {
      console.error("Erreur lors du téléchargement du bon de commande", error);
      alert("Une erreur est survenue lors du téléchargement du fichier.");
    }
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
              <th>Actions</th> {/* Nouvelle colonne pour les actions */}
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
                      onClick={() => handleDelete(bon.id)}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucun bon de commande trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeDesBonsDeCommande;
