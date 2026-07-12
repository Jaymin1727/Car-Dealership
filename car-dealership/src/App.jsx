import { useEffect, useState } from 'react';
import { useApp } from './store/AppContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AdminDrawer from './components/layout/AdminDrawer';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import InventorySection from './components/sections/InventorySection';
import AnalyticsSection from './components/sections/AnalyticsSection';
import DashboardHero from './components/sections/DashboardHero';
import AdminInventoryTable from './components/sections/AdminInventoryTable';
import SearchPanel from './components/ui/SearchPanel';
import PurchaseModal from './components/ui/PurchaseModal';
import Toast from './components/ui/Toast';

// Inner App component to use context
function DealershipApp() {
  const { setAnalyticsVisible, isAdmin } = useApp();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleExploreClick = () => {
    document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInsightsClick = () => {
    setAnalyticsVisible(true);
    setTimeout(() => {
      document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isDashboardRoute = currentPath === '/dashboard' && isAdmin;

  return (
    <>
      <Navbar
        onInventoryClick={handleExploreClick}
        onInsightsClick={handleInsightsClick}
      />

      <main>
        {isDashboardRoute ? (
          <>
            <DashboardHero />
            <AdminInventoryTable />
            <AnalyticsSection />
          </>
        ) : (
          <>
            <HeroSection onExploreClick={handleExploreClick} />
            <InventorySection />
            <AnalyticsSection />
          </>
        )}
      </main>

      <Footer />

      {/* Global Overlays */}
      <SearchPanel />
      <PurchaseModal />
      <AdminDrawer />
      <Toast />
    </>
  );
}

export default function App() {
  return <DealershipApp />;
}
