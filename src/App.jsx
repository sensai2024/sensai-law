import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

import Dashboard from './pages/Dashboard';
import ContractsList from './pages/ContractsList';
import ContractDetail from './pages/ContractDetail';
import Automations from './features/automations/pages/Automations';

const PlaceholderPage = ({ title }) => <div className="text-2xl font-bold p-4">{title} Placeholder</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="clients" element={<PlaceholderPage title="Clients" />} />
          <Route path="automations" element={<Automations />} />
          <Route path="feedback-bot" element={<PlaceholderPage title="Feedback Bot" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
