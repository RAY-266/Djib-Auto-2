
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  isAdmin?: boolean;
}

const CartPage: React.FC<CartPageProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { cart, totalPrice, updateQuantity, removeFromCart, totalItems } = useCart();

  return (
    <div className="flex flex-col pb-48 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Mon Panier</h2>
        <div className="w-10"></div>
      </header>

      <main className="p-4 flex-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-5xl text-slate-300">shopping_cart_off</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Votre panier est vide</h3>
            <p className="text-slate-400 text-sm mt-2 mb-8 leading-relaxed">
              Ajoutez des articles pour passer commande.
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{totalItems} Articles sélectionnés</p>
            {cart.map(item => (
              <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 animate-in slide-in-from-right duration-300">
                <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-primary font-black text-sm mt-0.5">{item.price}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="size-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 shadow-sm transition-transform active:scale-90"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="text-xs font-black dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="size-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-transform active:scale-90"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 p-2 hover:bg-red-50/50 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-5 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 z-50 max-w-md mx-auto shadow-2xl rounded-t-[40px]">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Montant Total</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{totalPrice.toLocaleString()} DJF</h4>
            </div>
            <div className="text-right">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">Paiement Cash</span>
            </div>
          </div>
          <button 
            className="w-full bg-primary text-white h-14 rounded-2xl font-black shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
            onClick={() => window.open(`https://wa.me/25377000000?text=Bonjour, je souhaite commander : ${cart.map(i => `${i.quantity}x ${i.title}`).join(', ')}. TOTAL: ${totalPrice.toLocaleString()} DJF`)}
          >
            <span>Commander (WhatsApp)</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      )}

      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

export default CartPage;
