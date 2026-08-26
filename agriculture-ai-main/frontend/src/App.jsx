import { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', color: '#fb7185', background: '#050905', minHeight: '100vh' }}>
          <h2 style={{ color: '#22c55e' }}>App Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#6e906f' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import './i18n';
import Login              from './pages/Login';
import Register           from './pages/Register';
import Dashboard          from './pages/Dashboard';
import FarmsList          from './pages/FarmsList';
import AddFarm            from './pages/AddFarm';
import SoilAnalysis       from './pages/SoilAnalysis';
import AIChat             from './pages/AIChat';
import CropRecommendation from './pages/CropRecommendation';
import WeatherAlerts      from './pages/WeatherAlerts';
import SoilHealth         from './pages/SoilHealth';
import FarmProfile        from './pages/FarmProfile';

const transition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

function AnimatedRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();

  const authProps = { setAuth: setIsAuthenticated };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={transition}
        style={{ minHeight: '100dvh' }}
      >
        <Routes location={location}>
          {/* ── Public routes ──────────────────── */}
          <Route path="/login"    element={!isAuthenticated ? <Login    {...authProps} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register {...authProps} /> : <Navigate to="/dashboard" />} />

          {/* ── Authenticated routes ───────────── */}
          <Route path="/dashboard"        element={isAuthenticated ? <Dashboard />          : <Navigate to="/login" />} />
          <Route path="/chat"             element={isAuthenticated ? <AIChat />             : <Navigate to="/login" />} />
          <Route path="/crops"            element={isAuthenticated ? <CropRecommendation /> : <Navigate to="/login" />} />
          <Route path="/weather"          element={isAuthenticated ? <WeatherAlerts />      : <Navigate to="/login" />} />
          <Route path="/soil"             element={isAuthenticated ? <SoilHealth />         : <Navigate to="/login" />} />
          <Route path="/profile"          element={isAuthenticated ? <FarmProfile />        : <Navigate to="/login" />} />

          {/* ── Legacy routes (keep existing backend integration) */}
          <Route path="/farms"            element={isAuthenticated ? <FarmsList />          : <Navigate to="/login" />} />
          <Route path="/farms/add"        element={isAuthenticated ? <AddFarm />            : <Navigate to="/login" />} />
          <Route path="/analysis/:farmId" element={isAuthenticated ? <SoilAnalysis />       : <Navigate to="/login" />} />

          {/* ── Fallback ───────────────────────── */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  return (
    <ErrorBoundary>
      <Router>
        <AnimatedRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </ErrorBoundary>
  );
}
