import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardUser from './components/DashbordUser'; 
import Settings from './components/Settings';
import UserSettings from './components/UserSettings';
import RegisterUser from './components/RegisterUser';
import UserList from './components/UserList';
import RegisterFournisseur from './components/RegisterFournisseur';


function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardAdmin />} />
                <Route path="/dashboardUser" element={<DashboardUser />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/usersettings" element={<UserSettings />} />
                <Route path="/settings/addUser" element={<RegisterUser />} />
                <Route path="/settings/addFourni" element={<RegisterFournisseur />} />
                <Route path="/users" element={<UserList/>} />
            </Routes>
        </Router>
    );
}

export default App;
