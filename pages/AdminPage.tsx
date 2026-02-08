
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getVendorShop, getVendorProducts, saveShop, addProduct, deleteProduct } from '../services/dataManager';
import { Product, Shop } from '../types';

interface AdminPageProps {
  isAdmin: boolean;
  vendorId: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ isAdmin, vendorId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const shopFileRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);
  
  const [currentShopId, setCurrentShopId] = useState<number | null>(null);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopImage, setShopImage] = useState("https://images.unsplash.com/photo-1552526881-721ce8509abb?auto=format&fit=crop&q=80&w=400");
  
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [newPName, setNewPName] = useState("");
  const [newPPrice, setNewPPrice] = useState("");
  const [newPDesc, setNewPDesc] = useState("");
  const [newPCategory, setNewPCategory] = useState<'Moteur' | 'Freinage' | 'Suspension' | 'Éclairage'>('Moteur');
  const [newPImage, setNewPImage] = useState("");

  const loadVendorData = async () => {
    try {
      const myShop = await getVendorShop(vendorId);
      if (myShop) {
        setCurrentShopId(myShop.id);
        setShopName(myShop.name);
        setShopDesc(myShop.description);
        setShopPhone(myShop.phone || "");
        setShopImage(myShop.image);
      }
      const products = await getVendorProducts(vendorId);
      setMyProducts(products);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendorData();
  }, [vendorId]);

  const compressImage = (base64Str: string, maxWidth = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'shop' | 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const optimized = await compressImage(reader.result as string);
      if (target === 'shop') setShopImage(optimized);
      else setNewPImage(optimized);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateShop = async () => {
    if (!shopName) return alert("Nom de boutique requis");
    setSaving(true);
    try {
      const shopData = {
        name: shopName,
        description: shopDesc,
        phone: shopPhone,
        type: "Vendeur Agréé",
        rating: "5.0",
        image: shopImage,
        hours: "08:00 - 18:00",
        location: "Djibouti Ville",
        verified: true,
        status: "Ouvert" as const
      };
      await saveShop(vendorId, shopData);
      alert("Boutique mise à jour !");
    } catch (err: any) {
      alert("Erreur de sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShopId) return alert("Configurez votre boutique d'abord");
    if (!newPImage) return alert("Photo obligatoire");

    setSaving(true);
    try {
      const pData = {
        title: newPName,
        subtitle: `${newPCategory} • Neuf`,
        price: `${parseInt(newPPrice).toLocaleString()} DJF`,
        category: newPCategory,
        shopId: currentShopId,
        image: newPImage,
        description: newPDesc || "Pièce détachée de qualité."
      };
      
      const res = await addProduct(pData, vendorId);
      if (res && res.length > 0) {
        setMyProducts([res[0], ...myProducts]);
        setNewPName("");
        setNewPPrice("");
        setNewPDesc("");
        setNewPImage("");
        alert("Produit publié !");
      }
    } catch (err: any) {
      alert("Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    const idToDelete = Number(id);
    const idStr = String(id);
    
    // Retrait visuel immédiat pour une sensation de rapidité
    setMyProducts(current => current.filter(p => Number(p.id) !== idToDelete));
    setDeletingId(idStr);

    try {
      await deleteProduct(idToDelete);
    } catch (err: any) {
      console.error("Erreur serveur lors de la suppression:", err);
      const refresh = await getVendorProducts(vendorId);
      setMyProducts(refresh);
      alert("Impossible de supprimer cet article du serveur.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="flex flex-col pb-32 min-h-screen bg-slate-50 dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-surface-dark p-4 border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-full active:scale-90">
          <span className="material-symbols-outlined">home</span>
        </button>
        <h2 className="text-lg font-black uppercase flex-1 text-center pr-10 tracking-tighter">Ma Gestion</h2>
      </header>

      <main className="p-4 flex flex-col gap-6">
        
        {/* CONFIGURATION BOUTIQUE */}
        <section className="bg-white dark:bg-surface-dark rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center gap-4 mb-5">
            <div className="relative size-20 cursor-pointer" onClick={() => shopFileRef.current?.click()}>
              <img src={shopImage} className="w-full h-full rounded-2xl object-cover shadow-md" alt="Shop" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">camera_alt</span>
              </div>
            </div>
            <input type="file" hidden ref={shopFileRef} accept="image/*" onChange={(e) => handleFileChange(e, 'shop')} />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ma Boutique</p>
          </div>
          <div className="flex flex-col gap-3">
            <input className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 text-sm font-bold border-none" placeholder="Nom de l'enseigne" value={shopName} onChange={(e) => setShopName(e.target.value)} />
            <input className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-4 text-sm font-bold border-none" placeholder="WhatsApp" value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} />
            <button onClick={handleUpdateShop} disabled={saving} className="h-12 w-full bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 shadow-lg shadow-primary/20">
              Enregistrer les infos
            </button>
          </div>
        </section>

        {/* AJOUT DE PRODUIT (STYLE CAPTURE D'ÉCRAN) */}
        <section className={`bg-white dark:bg-surface-dark rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 ${!currentShopId ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-5">METTRE EN VENTE</h3>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            
            {/* Zone Photo */}
            <div 
              className="relative h-44 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
              onClick={() => productFileRef.current?.click()}
            >
              {newPImage ? (
                <img src={newPImage} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-slate-300 text-5xl">add_a_photo</span>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ajouter Photo</p>
                </div>
              )}
              <input type="file" hidden ref={productFileRef} accept="image/*" onChange={(e) => handleFileChange(e, 'product')} />
            </div>

            {/* Champs Texte */}
            <input required className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-5 text-sm font-bold border-none placeholder-slate-400" placeholder="Nom de la pièce" value={newPName} onChange={(e) => setNewPName(e.target.value)} />
            
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-5 text-sm font-bold border-none placeholder-slate-400" placeholder="Prix (DJF)" value={newPPrice} onChange={(e) => setNewPPrice(e.target.value)} />
              
              <select required className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 px-5 text-sm font-bold border-none appearance-none" value={newPCategory} onChange={(e) => setNewPCategory(e.target.value as any)}>
                <option value="Moteur">Cat: Moteur</option>
                <option value="Freinage">Cat: Freinage</option>
                <option value="Suspension">Cat: Suspension</option>
                <option value="Éclairage">Cat: Éclairage</option>
              </select>
            </div>

            <textarea 
              className="w-full min-h-[100px] rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-5 text-sm font-medium border-none resize-none placeholder-slate-400" 
              placeholder="Petite description du produit (ex: Neuf, compatible Toyota Hilux 2018...)" 
              value={newPDesc} 
              onChange={(e) => setNewPDesc(e.target.value)} 
            />

            <button type="submit" disabled={saving} className="h-16 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all">
              {saving ? 'Publication...' : 'METTRE EN LIGNE'}
            </button>
          </form>
        </section>

        {/* MON CATALOGUE */}
        <section className="flex flex-col gap-4">
          <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-2">MON CATALOGUE ({myProducts.length})</h3>
          <div className="flex flex-col gap-3">
            {myProducts.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-300 font-black uppercase text-[10px]">Aucun article en ligne</div>
            ) : (
              myProducts.map(p => (
                <div key={p.id} className="bg-white dark:bg-surface-dark p-3 rounded-[28px] flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                  <div className="size-16 rounded-[20px] bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{p.title}</p>
                    <p className="text-primary font-black text-[13px]">{p.price}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    disabled={deletingId === String(p.id)}
                    className="size-12 flex items-center justify-center rounded-[18px] bg-red-50 text-red-500 active:scale-90 transition-all shrink-0"
                  >
                    {deletingId === String(p.id) ? (
                      <div className="size-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <span className="material-symbols-outlined text-xl">delete</span>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

export default AdminPage;
