
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getProducts, getShops } from '../services/dataManager';
import { useCart } from '../contexts/CartContext';
import { Product, Shop } from '../types';

interface SearchResultsPageProps {
  isAdmin?: boolean;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getQueryFromUrl = () => new URLSearchParams(location.search).get('q') || '';
  const [inputValue, setInputValue] = useState(getQueryFromUrl());
  const query = getQueryFromUrl();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [products, shops] = await Promise.all([
          getProducts(),
          getShops()
        ]);
        setAllProducts(products);
        setAllShops(shops);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    setInputValue(getQueryFromUrl());
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

  const results = allProducts.filter(p => {
    if (searchTerms.length === 0) return true;
    const combinedText = `${p.title} ${p.category} ${p.subtitle} ${p.description}`.toLowerCase();
    return searchTerms.every(term => combinedText.includes(term));
  });

  const getShopName = (id: number) => allShops.find(s => s.id === id)?.name || "Boutique Pro";

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center p-4 gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <div className="flex items-center h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 gap-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500" type="text" placeholder="Rechercher une pièce..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
          </form>
        </div>
      </header>

      <main className="p-4 flex-1">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em]">{results.length} {results.length > 1 ? 'Articles trouvés' : 'Article trouvé'}</p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map(item => (
                  <div key={item.id} className="group bg-white dark:bg-surface-dark rounded-[30px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden active:scale-[0.98] transition-all flex flex-col">
                    <Link to={`/product/${item.id}`} className="relative aspect-square bg-slate-100"><img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></Link>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <Link to={`/product/${item.id}`}><h3 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2 uppercase tracking-tighter">{item.title}</h3></Link>
                      <div className="mt-4">
                        <p className="text-primary font-black text-sm">{item.price}</p>
                        <button onClick={() => addToCart(item)} className="mt-3 w-full py-2.5 rounded-xl bg-primary text-white text-[10px] font-black shadow-md shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest">Ajouter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-10"><span className="material-symbols-outlined text-4xl text-slate-300">search_off</span><h3 className="text-lg font-black text-slate-900 dark:text-white uppercase mt-4">Aucun résultat</h3></div>
            )}
          </>
        )}
      </main>
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

export default SearchResultsPage;
