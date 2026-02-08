
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, getShops } from '../services/dataManager';
import { useCart } from '../contexts/CartContext';
import { Product, Shop } from '../types';

interface ProductDetailPageProps {
  isAdmin?: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [products, shops] = await Promise.all([
          getProducts(),
          getShops()
        ]);
        
        const foundProduct = products.find(p => p.id === Number(id));
        if (foundProduct) {
          setProduct(foundProduct);
          const foundShop = shops.find(s => s.id === foundProduct.shopId);
          if (foundShop) {
            setShop(foundShop);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  if (!product) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500 font-bold uppercase">Produit introuvable</p></div>;

  const whatsappNumber = shop?.phone || "25377000000";
  const whatsappMsg = `Bonjour ${shop?.name || 'Djib-Auto'}, je suis intéressé par : ${product.title} (${product.price})`;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-surface-dark relative">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Détails</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 pb-32">
        <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden"><img src={product.image} alt={product.title} className="w-full h-full object-cover" /></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
               <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded w-fit text-[10px] font-black uppercase mb-1">En Stock</span>
               <p className="text-slate-400 text-[10px] font-bold">Vendu par <span className="text-primary font-black underline">{shop?.name || "Vendeur Pro"}</span></p>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">{product.title}</h1>
          <p className="text-primary text-2xl font-black mb-6">{product.price}</p>
          <div className="mb-8"><h3 className="text-slate-900 dark:text-white text-base font-black mb-3 uppercase tracking-wide">Description</h3><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{product.description || "Pièce détachée certifiée par Marketplace Djibouti."}</p></div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 max-w-md mx-auto">
        <div className="flex gap-3">
          <button onClick={() => addToCart(product)} className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-primary flex items-center justify-center hover:bg-primary hover:text-white shadow-sm"><span className="material-symbols-outlined filled">add_shopping_cart</span></button>
          <button className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#25D366] text-white font-black shadow-lg shadow-green-500/20 uppercase tracking-widest text-[11px]" onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`)}><span className="material-symbols-outlined filled text-lg">chat</span><span>WhatsApp</span></button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
