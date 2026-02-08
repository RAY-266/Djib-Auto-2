
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage';
import ShopsPage from './pages/ShopsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('djib_auto_loggedin') === 'true';
  });
  
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('djib_auto_role') === 'admin';
  });

  const [currentVendorId, setCurrentVendorId] = useState<string | null>(() => {
    return localStorage.getItem('djib_auto_vendor_id');
  });

  const handleLogin = (role: 'client' | 'admin', vendorId?: string) => {
    localStorage.setItem('djib_auto_loggedin', 'true');
    localStorage.setItem('djib_auto_role', role);
    if (vendorId) {
      localStorage.setItem('djib_auto_vendor_id', vendorId);
      setCurrentVendorId(vendorId);
    }
    setIsAuthenticated(true);
    setIsAdmin(role === 'admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('djib_auto_loggedin');
    localStorage.removeItem('djib_auto_role');
    localStorage.removeItem('djib_auto_vendor_id');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentVendorId(null);
  };

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-background-dark shadow-xl min-h-screen relative overflow-x-hidden font-display">
            <Routes>
              <Route 
                path="/auth" 
                element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <AuthPage onLogin={handleLogin} />} 
              />

              <Route 
                path="/" 
                element={isAuthenticated ? <HomePage onLogout={handleLogout} isAdmin={isAdmin} /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/shops" 
                element={isAuthenticated ? <ShopsPage isAdmin={isAdmin} /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/search" 
                element={isAuthenticated ? <SearchResultsPage isAdmin={isAdmin} /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/product/:id" 
                element={isAuthenticated ? <ProductDetailPage isAdmin={isAdmin} /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/cart" 
                element={isAuthenticated ? <CartPage isAdmin={isAdmin} /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/admin" 
                element={isAuthenticated && isAdmin ? <AdminPage isAdmin={isAdmin} vendorId={currentVendorId || ''} /> : <Navigate to="/auth" replace />} 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
