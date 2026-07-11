/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import mockVehicles from '../data/mockVehicles';
import authApi from '../api/authApi';
import vehicleApi from '../api/vehicleApi';

// ============================================================
// Initial State
// ============================================================
// Load persisted auth state from localStorage
function loadAuthState() {
  try {
    const users = JSON.parse(localStorage.getItem('mmotor_users') || '[]');
    const current = JSON.parse(localStorage.getItem('mmotor_currentUser') || 'null');
    return { registeredUsers: users, currentUser: current };
  } catch {
    return { registeredUsers: [], currentUser: null };
  }
}

const authState = loadAuthState();

const initialState = {
  vehicles: [], // Initially empty, will load from backend
  purchases: [],
  isAdmin: false,
  darkMode: false,
  searchQuery: '',
  activeFilters: ['All'],
  sortBy: 'featured',
  priceRange: [0, 250000],
  toast: null,
  purchaseModal: null, // vehicle object being purchased
  adminDrawerOpen: false,
  searchPanelOpen: false,
  analyticsVisible: false,
  totalRevenue: 0,
  // Auth
  currentUser: authState.currentUser,
  registeredUsers: authState.registeredUsers,
};

// ============================================================
// Action Types
// ============================================================
const ACTIONS = {
  // Vehicles
  SET_VEHICLES: 'SET_VEHICLES',
  ADD_VEHICLE: 'ADD_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DELETE_VEHICLE: 'DELETE_VEHICLE',
  PURCHASE_VEHICLE: 'PURCHASE_VEHICLE',
  RESTOCK_VEHICLE: 'RESTOCK_VEHICLE',

  // UI
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_SEARCH: 'SET_SEARCH',
  SET_FILTERS: 'SET_FILTERS',
  SET_SORT: 'SET_SORT',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_TOAST: 'SET_TOAST',
  SET_PURCHASE_MODAL: 'SET_PURCHASE_MODAL',
  SET_ADMIN_DRAWER: 'SET_ADMIN_DRAWER',
  SET_SEARCH_PANEL: 'SET_SEARCH_PANEL',
  SET_ANALYTICS_VISIBLE: 'SET_ANALYTICS_VISIBLE',
  TOGGLE_ADMIN: 'TOGGLE_ADMIN',

  // Auth
  REGISTER_USER: 'REGISTER_USER',
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
};

// ============================================================
// Reducer
// ============================================================
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VEHICLES:
      return {
        ...state,
        vehicles: action.payload,
      };

    case ACTIONS.ADD_VEHICLE:
      return {
        ...state,
        vehicles: [action.payload, ...state.vehicles],
      };

    case ACTIONS.UPDATE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.map(v =>
          v.id === action.payload.id ? { ...v, ...action.payload } : v
        ),
      };

    case ACTIONS.DELETE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.filter(v => v.id !== action.payload),
      };

    case ACTIONS.PURCHASE_VEHICLE: {
      const purchase = action.payload;
      return {
        ...state,
        vehicles: state.vehicles.map(v =>
          v.id === purchase.vehicleId ? { ...v, stock: v.stock - purchase.quantity } : v
        ),
        purchases: [
          purchase,
          ...state.purchases,
        ],
        totalRevenue: state.totalRevenue + purchase.totalPrice,
      };
    }

    case ACTIONS.RESTOCK_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.map(v =>
          v.id === action.payload.id ? action.payload : v
        ),
      };

    case ACTIONS.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };

    case ACTIONS.SET_SEARCH:
      return { ...state, searchQuery: action.payload };

    case ACTIONS.SET_FILTERS:
      return { ...state, activeFilters: action.payload };

    case ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload };

    case ACTIONS.SET_PRICE_RANGE:
      return { ...state, priceRange: action.payload };

    case ACTIONS.SET_TOAST:
      return { ...state, toast: action.payload };

    case ACTIONS.SET_PURCHASE_MODAL:
      return { ...state, purchaseModal: action.payload };

    case ACTIONS.SET_ADMIN_DRAWER:
      return { ...state, adminDrawerOpen: action.payload };

    case ACTIONS.SET_SEARCH_PANEL:
      return { ...state, searchPanelOpen: action.payload };

    case ACTIONS.SET_ANALYTICS_VISIBLE:
      return { ...state, analyticsVisible: action.payload };

    case ACTIONS.TOGGLE_ADMIN:
      return { ...state, isAdmin: !state.isAdmin };

    case ACTIONS.REGISTER_USER:
      localStorage.setItem('mmotor_token', action.payload.token);
      localStorage.setItem('mmotor_currentUser', JSON.stringify(action.payload));
      return { ...state, currentUser: action.payload, isAdmin: action.payload.role === 'ADMIN' };

    case ACTIONS.LOGIN_USER:
      localStorage.setItem('mmotor_token', action.payload.token);
      localStorage.setItem('mmotor_currentUser', JSON.stringify(action.payload));
      return { ...state, currentUser: action.payload, isAdmin: action.payload.role === 'ADMIN' };

    case ACTIONS.LOGOUT_USER:
      localStorage.removeItem('mmotor_token');
      localStorage.removeItem('mmotor_currentUser');
      return { ...state, currentUser: null, isAdmin: false };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load vehicles from backend on mount, if logged in
  const loadVehicles = useCallback(async () => {
    if (!state.currentUser) return;
    try {
      const data = await vehicleApi.getAllVehicles();
      dispatch({ type: ACTIONS.SET_VEHICLES, payload: data });
    } catch (err) {
      showToast(err.message || 'Failed to load vehicles', 'error');
    }
  }, [state.currentUser]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Actions
  const addVehicle = useCallback(async (vehicle) => {
    try {
      const created = await vehicleApi.addVehicle(vehicle);
      dispatch({ type: ACTIONS.ADD_VEHICLE, payload: created });
      showToast('Vehicle added successfully');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to add vehicle', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const updateVehicle = useCallback(async (vehicle) => {
    try {
      const updated = await vehicleApi.updateVehicle(vehicle.id, vehicle);
      dispatch({ type: ACTIONS.UPDATE_VEHICLE, payload: updated });
      showToast('Vehicle updated successfully');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to update vehicle', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const deleteVehicle = useCallback(async (id) => {
    try {
      await vehicleApi.deleteVehicle(id);
      dispatch({ type: ACTIONS.DELETE_VEHICLE, payload: id });
      showToast('Vehicle deleted successfully');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete vehicle', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const purchaseVehicle = useCallback(async (vehicleId, quantity) => {
    try {
      const purchase = await vehicleApi.purchaseVehicle(vehicleId, quantity);
      dispatch({ type: ACTIONS.PURCHASE_VEHICLE, payload: purchase });
      showToast('Purchase completed successfully!');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to purchase vehicle', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const restockVehicle = useCallback(async (id, amount) => {
    try {
      const updated = await vehicleApi.restockVehicle(id, amount);
      dispatch({ type: ACTIONS.RESTOCK_VEHICLE, payload: updated });
      showToast('Vehicle restocked successfully');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to restock vehicle', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const setDarkMode = useCallback((val) => {
    dispatch({ type: ACTIONS.SET_DARK_MODE, payload: val });
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
  }, []);

  const setSearch = useCallback((q) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: q });
  }, []);

  const setFilters = useCallback((f) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: f });
  }, []);

  const setSort = useCallback((s) => {
    dispatch({ type: ACTIONS.SET_SORT, payload: s });
  }, []);

  const setPriceRange = useCallback((r) => {
    dispatch({ type: ACTIONS.SET_PRICE_RANGE, payload: r });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    dispatch({ type: ACTIONS.SET_TOAST, payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: ACTIONS.SET_TOAST, payload: null });
    }, 4000);
  }, []);

  const openPurchaseModal = useCallback((vehicle) => {
    dispatch({ type: ACTIONS.SET_PURCHASE_MODAL, payload: vehicle });
  }, []);

  const closePurchaseModal = useCallback(() => {
    dispatch({ type: ACTIONS.SET_PURCHASE_MODAL, payload: null });
  }, []);

  const setAdminDrawer = useCallback((open) => {
    dispatch({ type: ACTIONS.SET_ADMIN_DRAWER, payload: open });
  }, []);

  const setSearchPanel = useCallback((open) => {
    dispatch({ type: ACTIONS.SET_SEARCH_PANEL, payload: open });
  }, []);

  const setAnalyticsVisible = useCallback((val) => {
    dispatch({ type: ACTIONS.SET_ANALYTICS_VISIBLE, payload: val });
  }, []);

  const toggleAdmin = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_ADMIN });
  }, []);

  // Auth actions
  const registerUser = useCallback(async (name, email, password) => {
    try {
      const data = await authApi.register(name, email, password);
      dispatch({ type: ACTIONS.REGISTER_USER, payload: data });
      showToast('Registration successful! Welcome to M MOTOR');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const loginUser = useCallback(async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      dispatch({ type: ACTIONS.LOGIN_USER, payload: data });
      showToast('Welcome back to M MOTOR');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message };
    }
  }, []);

  const logoutUser = useCallback(() => {
    dispatch({ type: ACTIONS.LOGOUT_USER });
    showToast('Signed out successfully');
  }, []);

  // Computed: filtered + sorted vehicles
  const filteredVehicles = (() => {
    let result = [...state.vehicles];

    // Search
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.fuel.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (!state.activeFilters.includes('All')) {
      result = result.filter(v => state.activeFilters.some(f => {
        if (f === 'BMW') return true; // all are BMW
        return v.category === f || v.fuel === f || v.tags?.includes(f);
      }));
    }

    // Price range
    result = result.filter(v =>
      v.price >= state.priceRange[0] && v.price <= state.priceRange[1]
    );

    // Sort
    switch (state.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'hp-desc': result.sort((a, b) => b.horsepower - a.horsepower); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'stock': result.sort((a, b) => b.stock - a.stock); break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  })();

  const value = {
    // State
    ...state,
    filteredVehicles,

    // Actions
    addVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
    setDarkMode,
    setSearch,
    setFilters,
    setSort,
    setPriceRange,
    showToast,
    openPurchaseModal,
    closePurchaseModal,
    setAdminDrawer,
    setSearchPanel,
    setAnalyticsVisible,
    toggleAdmin,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
    return useContext(AppContext);
};

export default AppContext;
