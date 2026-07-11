import { useEffect, useState } from 'react';
import { useApp } from './store/AppContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AdminDrawer from './components/layout/AdminDrawer';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import InventorySection from './components/sections/InventorySection';
import AnalyticsSection from './components/sections/AnalyticsSection';
import SearchPanel from './components/ui/SearchPanel';
import PurchaseModal from './components/ui/PurchaseModal';
import Toast from './components/ui/Toast';

// Inner App component to use context
function DealershipApp() {
  const { setAnalyticsVisible } = useApp();
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

  const isDashboardRoute = currentPath === '/dashboard';

  return (
    <>
      <Navbar
        onInventoryClick={handleExploreClick}
        onInsightsClick={handleInsightsClick}
      />

      <main>
        {isDashboardRoute ? (
          <section style={{ padding: '2rem 1.5rem 0', maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.75 }}>
                Dashboard
              </p>
              <h1 style={{ margin: '0.4rem 0 0', fontSize: '2rem' }}>Welcome back to your dashboard</h1>
            </div>
            <InventorySection />
            <AnalyticsSection />
          </section>
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
