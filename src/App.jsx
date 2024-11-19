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
                <Route path="/fournissseurlist" element={<FournisseurList/>} />
                <Route path="/ListeDesBonsDeCommande" element={<ListeDesBonsDeCommande/>} />

                
                
            </Routes>
        </Router>
    );
}

export default App;
