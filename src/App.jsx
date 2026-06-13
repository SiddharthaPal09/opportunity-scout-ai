import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import OpportunitiesPage from './pages/OpportunitiesPage.jsx';
import OpportunityDetailPage from './pages/OpportunityDetailPage.jsx';
import SkillInsightsPage from './pages/SkillInsightsPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import AgentActivityPage from './pages/AgentActivityPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="/skill-insights" element={<SkillInsightsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/agents" element={<AgentActivityPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
