import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Hosts from './pages/Hosts';
import HostDetail from './pages/HostDetail';
import Alerts from './pages/Alerts';
import Inventory from './pages/Inventory';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hosts" element={<Hosts />} />
          <Route path="/hosts/:hostname" element={<HostDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
