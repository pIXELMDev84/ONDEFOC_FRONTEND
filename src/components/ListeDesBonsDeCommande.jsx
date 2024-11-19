import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Slidebar.jsx";
import "../css/ListeDesBonsDeCommande.css";

const ListeDesBonsDeCommande = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState([]); // Liste des bons de commande
  const [message, setMessage] = useState('');

  // Fonction pour récupérer les bons de commande depuis le backend
  useEffect(() => {
    const fetchBonsDeCommande = async () => {
      try {
        // Remplace l'URL par celle qui correspond à ton API pour récupérer les bons de commande
        const response = await axios.get('http://localhost:8000/api/abdcm');
        setBonsDeCommande(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des bons de commande", error);
        setMessage('Erreur lors de la récupération des bons de commande');
      }
    };
    fetchBonsDeCommande();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {bonsDeCommande.length > 0 ? (
              bonsDeCommande.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.code}</td>
                  <td>{bon.fournisseur.nom}</td>
                  <td>{bon.fournisseur.num_telephone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucun bon de commande trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeDesBonsDeCommande;
