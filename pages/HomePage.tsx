
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getProducts, getShops } from '../services/dataManager';
import { useCart } from '../contexts/CartContext';
import { Product, Shop } from '../types';

interface HomePageProps {
  onLogout: () => void;
  isAdmin: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout, isAdmin }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [searchValue, setSearchValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, shops] = await Promise.all([
          getProducts(),
          getShops()
        ]);
        setAllProducts(products);
        setAllShops(shops);
      } catch (err) {
        console.error("Failed to load data from Supabase", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const categories = [
    { icon: 'grid_view', label: 'Tout' },
    { icon: 'settings_suggest', label: 'Moteur' },
    { icon: 'tire_repair', label: 'Freinage' },
    { icon: 'handyman', label: 'Suspension' },
    { icon: 'lightbulb', label: 'Éclairage' }
  ];

  const filteredProducts = selectedCategory === 'Tout' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const getShopName = (id: number) => allShops.find(s => s.id === id)?.name || "Vendeur Agréé";

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl filled">directions_car</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter">DJIB AUTO</h2>
        </div>
        <div className="relative">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">account_circle</span>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                 <p className="text-[10px] font-black uppercase text-slate-400">Session {isAdmin ? 'Vendeur' : 'Client'}</p>
              </div>
              {isAdmin && (
                <button onClick={() => navigate('/admin')} className="w-full px-4 py-2 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">settings</span>Tableau de bord
                </button>
              )}
              <button onClick={onLogout} className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span>Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : (
        <>
          <div className="px-4 py-5">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Rechercher une pièce..." className="w-full h-14 bg-white dark:bg-slate-800 rounded-2xl px-12 text-sm font-medium border-none shadow-sm focus:ring-2 focus:ring-primary transition-all dark:text-white" />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-xl shadow-lg"><span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </form>
          </div>

          <div className="mb-8">
            <div className="px-4 flex items-center justify-between mb-4"><h3 className="text-slate-900 dark:text-white text-base font-black uppercase tracking-wide">Par catégories</h3></div>
            <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat, i) => (
                <button key={i} onClick={() => setSelectedCategory(cat.label)} className={`flex flex-col items-center gap-3 shrink-0 transition-all ${selectedCategory === cat.label ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                  <div className={`size-16 rounded-3xl flex items-center justify-center shadow-lg transition-all ${selectedCategory === cat.label ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-white dark:bg-slate-800 text-slate-500'}`}><span className={`material-symbols-outlined text-2xl ${selectedCategory === cat.label ? 'filled' : ''}`}>{cat.icon}</span></div>
                  <span className="text-[11px] font-bold uppercase tracking-tighter text-slate-700 dark:text-slate-400">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-slate-900 dark:text-white text-lg font-black">{selectedCategory === 'Tout' ? 'Pièces Populaires' : selectedCategory}</h3>
              <span className="text-slate-400 text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">{filteredProducts.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 px-4 mb-10">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-white dark:bg-slate-800 p-4 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all flex gap-5 animate-in fade-in duration-300">
                <Link to={`/product/${product.id}`} className="w-32 h-32 shrink-0 rounded-3xl bg-slate-100 dark:bg-slate-700 overflow-hidden"><img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></Link>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <Link to={`/product/${product.id}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">{product.category}</span>
                      <span className="text-[9px] font-bold text-slate-400 truncate max-w-[80px]">{getShopName(product.shopId)}</span>
                    </div>
                    <h4 className="text-slate-900 dark:text-white text-base font-bold leading-tight line-clamp-2">{product.title}</h4>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary text-xl font-black">{product.price}</p>
                    <button onClick={() => addToCart(product)} className="size-10 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-90"><span className="material-symbols-outlined text-lg">add_shopping_cart</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

export default HomePage;
