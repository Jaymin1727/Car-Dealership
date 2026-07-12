import { createRoot } from 'react-dom/client';
import './styles/global/index.css';
import App from './App.jsx';
import { AppProvider } from './store/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
