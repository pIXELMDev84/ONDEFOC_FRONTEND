import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiSettings, FiUser, FiUsers, FiLogOut, FiFileText, FiClipboard, FiCheckSquare, FiArchive, FiInbox } from "react-icons/fi"; // Import FiArchive for stock status
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
                {/* Dashboard Link */}
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    <FiHome />
                    {isOpen && <span> Dashboard</span>}
                </Link>


                {userRole === "chefservice" && (
                    <>
                        <Link to="/chefsettings" className={location.pathname === "/chefsettings" ? "active" : ""}>
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
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
          <FiArchive />
          {isOpen && <span>État du Stock</span>}
        </Link>
                    </>
                )}

                {/* Settings Link - Admin */}
                {userRole === "admin" && (
                    <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                )}

                {/* Settings Link - User (Restricted to their own settings) */}
                {userRole === "user" && (
                    <Link to="/usersettings" className={location.pathname === "/usersettings" ? "active" : ""}>
                        <FiSettings />
                        {isOpen && <span> Paramètres</span>}
                    </Link>
                )}

                {/* Admin-Only Links - Users and Clients */}
                {userRole === "admin" && (
                    <>
                        <Link to="/users" className={location.pathname === "/users" ? "active" : ""}>
                            <FiUser />
                            {isOpen && <span> Utilisateurs</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeCommande" className={location.pathname === "/ListeDesBonsDeCommande" ? "active" : ""}>
                            <FiFileText />
                            {isOpen && <span>Bon de commande</span>}
                        </Link>
                        <Link to="/ListeDesBonsDeReception" className={location.pathname === "/ListeDesBonsDeReception" ? "active" : ""}>
                            <FiCheckSquare />
                            {isOpen && <span>Bons de réception</span>}
                        </Link>
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
          <FiArchive />
          {isOpen && <span>État du Stock</span>}
          </Link>
                    </>
                )}
                

                {/* Links for Magasinier */}
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
                        <Link to="/EtatDeStock" className={location.pathname === "/EtatDeStock" ? "active" : ""}>
          <FiArchive />
          {isOpen && <span>État du Stock</span>}
        </Link>
                    </>
                )}
            </nav>

            {/* Logout link positioned at the bottom */}
            <div className="logout" onClick={handleLogout}>
                <FiLogOut />
                {isOpen && <span>Déconnexion</span>}
            </div>
        </div>
    );
}

export default Sidebar;
