import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Slidebar.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import des icônes
import "../css/FournisseurList.css";  // Réutilisation du CSS

function Popup({ message, onConfirm, onCancel }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="confirm-button" onClick={onConfirm}>
                        Oui
                    </button>
                    <button className="cancel-button" onClick={onCancel}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

function FournisseurList() {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [currentFournisseurId, setCurrentFournisseurId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [fournisseurToDelete, setFournisseurToDelete] = useState(null);

    useEffect(() => {
        const fetchFournisseurs = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/fournisseurs", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setFournisseurs(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des fournisseurs:", error);
            }
        };

        fetchFournisseurs();
    }, []);

    const filteredFournisseurs = fournisseurs.filter((fournisseur) => fournisseur.id !== currentFournisseurId);

    const handleEdit = (fournisseur) => {
        console.log("Modifier le fournisseur:", fournisseur);
        // Ajoutez ici la logique pour afficher un formulaire d'édition ou une popup
    };

    const handleDelete = (fournisseurId) => {
        setFournisseurToDelete(fournisseurId);
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/fournisseurs/${fournisseurToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== fournisseurToDelete));
            alert("Fournisseur supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression du fournisseur:", error);
            alert("Une erreur s'est produite lors de la suppression.");
        }
        setShowPopup(false);
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <h1>Liste des Fournisseurs</h1>
                {showPopup && (
                    <Popup
                        message="Êtes-vous sûr de vouloir supprimer ce fournisseur ?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
                <table className="fournisseur-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFournisseurs.map((fournisseur) => (
                            <tr key={fournisseur.id}>
                                <td className="fournisseur-name">{fournisseur.nom}</td>
                                <td className="fournisseur-subname">{fournisseur.prenom}</td>

                                <td>{fournisseur.email}</td>
                                <td>{fournisseur.num_telephone}</td> {/* Modifié ici */}
                                <td className="fournisseur-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(fournisseur)}
                                        title="Modifier"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(fournisseur.id)}
                                        title="Supprimer"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FournisseurList;
