
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface BottomNavProps {
  isAdmin?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ isAdmin = false }) => {
  const location = useLocation();
  const { totalItems } = useCart();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg pb-safe max-w-md mx-auto h-[80px]">
      <div className="grid grid-cols-4 h-full">
        <Link to="/" className={`flex flex-col items-center justify-center gap-1 ${isActive('/') ? 'text-primary' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined ${isActive('/') ? 'filled' : ''}`}>home</span>
          <span className="text-[10px] font-semibold uppercase tracking-tight">Accueil</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center justify-center gap-1 ${isActive('/search') ? 'text-primary' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined ${isActive('/search') ? 'filled' : ''}`}>search</span>
          <span className="text-[10px] font-medium uppercase tracking-tight">Recherche</span>
        </Link>
        
        {/* Si admin, mène à la gestion. Si client, mène à la liste des boutiques */}
        <Link 
          to={isAdmin ? "/admin" : "/shops"} 
          className={`flex flex-col items-center justify-center gap-1 ${(isActive('/admin') || isActive('/shops')) ? 'text-primary' : 'text-slate-400'} relative`}
        >
          <span className={`material-symbols-outlined ${(isActive('/admin') || isActive('/shops')) ? 'filled' : ''}`}>
            {isAdmin ? 'inventory_2' : 'storefront'}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-tight">
            {isAdmin ? 'Ma Gestion' : 'Boutiques'}
          </span>
          {isAdmin && isActive('/admin') && (
            <span className="absolute top-4 right-6 size-2 rounded-full bg-red-500 border border-white dark:border-background-dark"></span>
          )}
        </Link>

        <Link to="/cart" className={`flex flex-col items-center justify-center gap-1 ${isActive('/cart') ? 'text-primary' : 'text-slate-400'} relative`}>
          <div className="relative">
            <span className={`material-symbols-outlined ${isActive('/cart') ? 'filled' : ''}`}>shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-50 text-[9px] font-bold text-primary border border-primary/20">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-tight">Panier</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
