
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { getShops, deleteShop } from '../services/dataManager';
import { Shop } from '../types';

interface ShopsPageProps {
  isAdmin?: boolean;
}

const ShopsPage: React.FC<ShopsPageProps> = ({ isAdmin = false }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadShops = async (force = false) => {
    try {
      const data = await getShops(force);
      setShops(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  const handleDeleteShop = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    if (!confirm(`Voulez-vous vraiment supprimer la boutique "${name}" ?`)) return;
    
    setDeletingId(id);
    try {
      await deleteShop(id);
      setShops(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-dark px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Boutiques Partenaires</h1>
        {isAdmin && <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">Mode Admin</span>}
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
           <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-4">
          {shops.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase text-xs">Aucune boutique répertoriée</p>
            </div>
          ) : (
            shops.map(shop => (
              <div 
                key={shop.id} 
                onClick={() => setSelectedShop(shop)}
                className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-slate-900 dark:text-white font-black truncate text-sm uppercase">{shop.name}</p>
                    {shop.verified && <span className="material-symbols-outlined text-primary text-base filled">verified</span>}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{shop.type}</p>
                </div>
                
                {/* BOUTON SUPPRIMER (Visible uniquement si ADMIN pour nettoyer les tests) */}
                {isAdmin && (
                  <button 
                    onClick={(e) => handleDeleteShop(e, shop.id, shop.name)}
                    disabled={deletingId === shop.id}
                    className="size-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"
                  >
                    {deletingId === shop.id ? (
                      <div className="size-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <span className="material-symbols-outlined text-xl">delete</span>
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {selectedShop && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedShop(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-[40px] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-3 mb-4">
              <img src={selectedShop.image} className="size-12 rounded-xl object-cover" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">{selectedShop.name}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mb-6">
              {selectedShop.description}
            </p>
            {selectedShop.phone && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Contact Direct</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Business</p>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/${selectedShop.phone}`)}
                  className="bg-[#25D366] text-white px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Ouvrir
                </button>
              </div>
            )}
            <button 
              onClick={() => setSelectedShop(null)}
              className="w-full bg-slate-900 dark:bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

export default ShopsPage;
