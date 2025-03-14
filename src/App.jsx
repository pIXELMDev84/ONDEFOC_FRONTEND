import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardUser from './components/DashbordUser'; 
import Settings from './components/Settings';
import UserSettings from './components/UserSettings';
import RegisterUser from './components/RegisterUser';
import UserList from './components/UserList';
import RegisterFournisseur from './components/RegisterFournisseur';
import DashbordMagasinier from './components/DashbordMagasinier';
import BonDeCommande from './components/BonDeCommande';
import MagasinierSettings from './components/MagasinierSettings';
import FournisseurList from './components/FournisseurList';
import ListeDesBonsDeCommande from './components/ListeDesBonsDeCommande';
import AjouterProduit from './components/AjouterProduit';
import BonDeReception from './components/BonDeReception';
import ListeDesBonsDeReception from './components/ListeDesBonsDeReception';
import EtatDeStock from './components/EtatDeStock';
import ChefSettings from './components/ChefSettings';
import CatProduit from './components/CatProduit';

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardAdmin />} />
                <Route path="/dashboardUser" element={<DashboardUser />} />
                <Route path="/dashboardMagasinier" element={<DashbordMagasinier/>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/usersettings" element={<UserSettings />} />
                <Route path="/settings/addUser" element={<RegisterUser />} />
                <Route path="/settings/addFourni" element={<RegisterFournisseur />} />
                <Route path="/users" element={<UserList/>} />
                <Route path="/BonDeCommande/creation" element={<BonDeCommande/>} />
                <Route path="/magsettings" element={<MagasinierSettings/>} />
                <Route path="/chefsettings" element={<ChefSettings/>} />
                <Route path="/fournissseurlist" element={<FournisseurList/>} />
                <Route path="/ListeDesBonsDeCommande" element={<ListeDesBonsDeCommande/>} />
                <Route path="/AjouterProduit" element={<AjouterProduit/>} />
                <Route path="/BonDeReseption/creation" element={<BonDeReception/>} />
                <Route path="/ListeDesBonsDeReception" element={<ListeDesBonsDeReception/>} />
                <Route path="/EtatDeStock" element={<EtatDeStock />} />
                <Route path="/CatProduit" element={<CatProduit />} />
            </Routes>
        </Router>
    );
}

export default App;
