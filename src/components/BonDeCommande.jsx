import React, { useState } from "react";
import '../css/BonDeCommande.css';
import Sidebar from "./Slidebar.jsx";
import axios from "axios";

const BonDeCommande = () => {
    const [formData, setFormData] = useState({
        bonNumber: "",
        date: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        produits: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddProduct = () => {
        setFormData({
            ...formData,
            produits: [...formData.produits, { name: "", quantity: 1, price: 0 }],
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProduits = [...formData.produits];
        updatedProduits[index][name] = value;
        setFormData({
            ...formData,
            produits: updatedProduits,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Exemple de requête axios pour envoyer les données
        axios.post("http://127.0.0.1:8000/api/bon-de-commande", formData)
            .then(response => {
                console.log("Bon de commande créé avec succès", response);
                // Réinitialiser le formulaire ou rediriger l'utilisateur
            })
            .catch(error => {
                console.error("Erreur lors de la création du bon de commande", error);
            });
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="bon-de-commande-container">
                <h2>Créer un Bon de Commande</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Numéro du Bon :</label>
                        <input
                            type="text"
                            name="bonNumber"
                            value={formData.bonNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date :</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nom du Client :</label>
                        <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email du Client :</label>
                        <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Téléphone du Client :</label>
                        <input
                            type="tel"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <h3>Produits</h3>
                    {formData.produits.map((product, index) => (
                        <div key={index} className="product-group">
                            <div className="form-group">
                                <label>Nom du Produit :</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantité :</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, e)}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Prix Unitaire :</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, e)}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddProduct}>Ajouter un Produit</button>

                    <div className="form-group">
                        <button type="submit">Créer le Bon de Commande</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BonDeCommande;
