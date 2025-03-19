import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiSettings,FiUsers, FiLogOut, FiFileText, FiClipboard, FiDatabase ,FiCheckSquare, FiArchive, FiInbox } from "react-icons/fi";
import { FaRegUserCircle} from "react-icons/fa"; 
import { HiUsers } from "react-icons/hi";
import { PiArrowCounterClockwiseFill } from "react-icons/pi";
import { GiShoppingCart, GiFruitBowl, GiMeat, GiWheat } from "react-icons/gi";
import { FaCartArrowDown } from "react-icons/fa";


import "../css/Sidebar.css";
import logo from "../images/LOGO-ONDEFOC_BLAN.png";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role) {
            setUserRole(user.role);
        }
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login"); 
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="toggle-icon" onClick={toggleSidebar}>
                <FiMenu />
            </div>

            {isOpen && (
                <div className="sidebar-logo">
                    <img src={logo} alt="Company Logo" />
                </div>
            )}
            <nav>
                
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    <FaRegUserCircle />
                    {isOpen && <span> Mon Compte </span>}
                </Link>

                {userRole === "chefservice" && (
                    <>
                        <Link to="/chefsettings" className={location.pathname === "/chefsettings" ? "active" : ""}>
                            <FiSettings />
                            {isOpen && <span>Paramètres</span>}
                        </Link>
                        <Link to="/fournissseurlist" className={location.pathname === "/fournissseurlist" ? "active" : ""}>
                            <FiUsers />
                            {isOpen && <span>Fournisseur</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeCommande" className={location.pathname === "/ListeDesBonsDeCommande" ? "active" : ""}>
                            <FiFileText />
                            {isOpen && <span>Bon de commande</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeReception" className={location.pathname === "/ListeDesBonsDeReception" ? "active" : ""}>
                            <FiCheckSquare />
                            {isOpen && <span>Bons de réception</span>}
                        </Link>
                        <Link to="/ListeDesBonJournalier" className={location.pathname === "/ListeDesBonJournalier" ? "active" : ""}>
                        <PiArrowCounterClockwiseFill />
                            {isOpen && <span>Bon Journalier</span>}
                        </Link>
                        <Link to="/CatProduit" className={location.pathname === "/CatProduit" ? "active" : ""}>
                        <FaCartArrowDown />
                            {isOpen && <span>Produits</span>}
                        </Link>
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
                            <FiArchive />
                            {isOpen && <span>État du Stock</span>}
                        </Link>
                 
                    </>
                )}

                {userRole === "admin" && (
                    <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                )}

                {userRole === "user" && (
                    <Link to="/usersettings" className={location.pathname === "/usersettings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                )}

                {userRole === "admin" && (
                    <>
                        <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                            <FiUser />
                            {isOpen && <span> Utilisateurs</span>}
                        </Link>
                        <Link to="/fournissseurlist" className={location.pathname === "/fournissseurlist" ? "active" : ""}>
                            <FiUsers />
                            {isOpen && <span>Fournisseurs</span>}
                        </Link>

                        <Link to="/ListeDesBonsDeCommande" className={location.pathname === "/ListeDesBonsDeCommande" ? "active" : ""}>
                            <FiFileText />
                            {isOpen && <span>Bon de commandes</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeReception" className={location.pathname === "/ListeDesBonsDeReception" ? "active" : ""}>
                            <FiCheckSquare />
                            {isOpen && <span>Bons de réceptions</span>}
                        </Link>
                        <Link to="/ListeDesBonJournalier" className={location.pathname === "/ListeDesBonJournalier" ? "active" : ""}>
                        <PiArrowCounterClockwiseFill />
                            {isOpen && <span>Bon Journalier</span>}
                        </Link>
                        <Link to="/CatProduit" className={location.pathname === "/CatProduit" ? "active" : ""}>
                        <FaCartArrowDown />
                            {isOpen && <span>Produits</span>}
                        </Link>
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
                            <FiArchive />
                            {isOpen && <span>État des Stocks</span>}
                        </Link>
                    </>
                )}
                
                {userRole === "magasinier" && (
                    <>
                        <Link to="/magsettings" className={location.pathname === "/magsettings" ? "active" : ""}>
                            <FiSettings />
                            {isOpen && <span> Paramètres </span>}
                        </Link>
                        <Link to="/ListeDesBonsDeCommande" className={location.pathname === "/ListeDesBonsDeCommande" ? "active" : ""}>
                            <FiFileText />
                            {isOpen && <span>Bon de commande</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeReception" className={location.pathname === "/ListeDesBonsDeReception" ? "active" : ""}>
                            <FiCheckSquare />
                            {isOpen && <span>Bons de réception</span>}
                        </Link>
                        <Link to="/ListeDesBonJournalier" className={location.pathname === "/ListeDesBonJournalier" ? "active" : ""}>
                        <PiArrowCounterClockwiseFill />
                            {isOpen && <span>Bon Journalier</span>}
                        </Link>
                        <Link to="/CatProduit" className={location.pathname === "/CatProduit" ? "active" : ""}>
                        <FaCartArrowDown />
                            {isOpen && <span>Produits</span>}
                        </Link>
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
                            <FiArchive />
                            {isOpen && <span>État du Stock</span>}
                        </Link>
                    </>
                )}
            </nav>

            <div className="logout" onClick={handleLogout}>
                <FiLogOut />
                {isOpen && <span>Déconnexion</span>}
            </div>
        </div>
    );
}

export default Sidebar;
