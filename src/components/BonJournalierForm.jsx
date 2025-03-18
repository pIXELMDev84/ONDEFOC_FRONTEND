import { useState, useEffect } from "react";
import axios from "axios";

const BonJournalierForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [retraits, setRetraits] = useState([]);
  const [bonCode, setBonCode] = useState(""); // Stocke le code du bon créé

  // Charger les catégories et les produits en stock
  useEffect(() => {
    axios.get("http://localhost:8000/api/stock-global")
      .then(response => setCategories(response.data.categories))
      .catch(error => console.error("Erreur de chargement:", error));
  }, []);

  // Ajouter un produit au bon journalier
  const addRetrait = () => {
    if (!selectedCategory || !selectedProduct || !quantity) {
      alert("Veuillez sélectionner une catégorie, un produit et une quantité.");
      return;
    }

    const produit = categories
      .find(cat => cat.id === parseInt(selectedCategory))
      ?.products.find(prod => prod.id === parseInt(selectedProduct));

    if (!produit || quantity > produit.quantite) {
      alert("Stock insuffisant !");
      return;
    }

    setRetraits([...retraits, { produit_id: selectedProduct, quantite_retirer: parseInt(quantity), produit_nom: produit.name }]);
    setSelectedProduct("");
    setQuantity("");
  };

  // Supprimer un produit ajouté
  const removeRetrait = (index) => {
    setRetraits(retraits.filter((_, i) => i !== index));
  };

  // Soumettre le bon journalier
  const submitBonJournalier = () => {
    if (retraits.length === 0) {
      alert("Ajoutez au moins un produit !");
      return;
    }

    axios.post("http://localhost:8000/api/create/bons-journaliers", {
      date: new Date().toISOString().split("T")[0],
      produits: retraits
    }).then(response => {
      alert("Bon journalier créé !");
      setBonCode(response.data.bon_journalier.code);
      setRetraits([]);
    }).catch(error => {
      console.error("Erreur de soumission:", error);
      alert("Erreur lors de la création du bon journalier");
    });
  };

  return (
    <div>
      <h2>Créer un Bon Journalier</h2>

      {bonCode && <p><strong>Bon Journalier créé : {bonCode}</strong></p>}

      <label>Catégorie :</label>
      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">Sélectionner</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label>Produit :</label>
      <select 
        value={selectedProduct} 
        onChange={e => setSelectedProduct(e.target.value)}
        disabled={!selectedCategory}
      >
        <option value="">Sélectionner</option>
        {selectedCategory && categories.find(cat => cat.id === parseInt(selectedCategory))?.products.map(prod => (
          <option key={prod.id} value={prod.id}>{prod.name} (Stock: {prod.quantite})</option>
        ))}
      </select>

      <label>Quantité :</label>
      <input 
        type="number" 
        value={quantity} 
        onChange={e => setQuantity(e.target.value)}
        disabled={!selectedProduct}
        min="1"
      />

      <button onClick={addRetrait} disabled={!selectedProduct || !quantity}>Ajouter</button>

      <h3>Produits à retirer</h3>
      <ul>
        {retraits.map((item, index) => (
          <li key={index}>
            {item.produit_nom} - Quantité: {item.quantite_retirer}
            <button onClick={() => removeRetrait(index)}>❌</button>
          </li>
        ))}
      </ul>

      <button onClick={submitBonJournalier} disabled={retraits.length === 0}>Valider</button>
    </div>
  );
};

export default BonJournalierForm;
