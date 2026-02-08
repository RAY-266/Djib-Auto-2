
import React, { useState } from 'react';
import { registerClient, loginClient, loginVendor } from '../services/dataManager';

interface AuthPageProps {
  onLogin: (role: 'client' | 'admin', identifier?: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdminMode) {
        // MODE VENDEUR
        if (!password.trim()) {
          setError("Veuillez entrer votre code secret.");
          setLoading(false);
          return;
        }
        const vendor = await loginVendor(password);
        if (vendor && vendor.id) {
          onLogin('admin', String(vendor.id));
        } else {
          setError("Code secret invalide ou non répertorié.");
        }
      } else {
        // MODE CLIENT
        if (isRegisterMode) {
          if (!name.trim() || !phone.trim() || !email.trim()) {
            setError("Veuillez remplir tous les champs.");
            setLoading(false);
            return;
          }
          await registerClient(name, email, phone);
          alert("Compte créé ! Veuillez vous connecter.");
          setIsRegisterMode(false);
          setLoading(false);
        } else {
          const client = await loginClient(name, phone);
          if (client) {
            onLogin('client', phone.trim());
          } else {
            setError("Identifiants incorrects.");
          }
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
      <div className="relative w-full h-64 overflow-hidden rounded-b-[3rem]">
        <div 
          className="w-full h-full bg-center bg-no-repeat bg-cover transition-all duration-700" 
          style={{ 
            backgroundImage: `url(${isAdminMode 
              ? 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800' 
              : 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'})` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-surface-dark via-transparent to-black/40"></div>
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl border border-white/20">
            <span className={`material-symbols-outlined text-2xl filled ${isAdminMode ? 'text-slate-900 dark:text-white' : 'text-primary'}`}>
              {isAdminMode ? 'admin_panel_settings' : 'directions_car'}
            </span>
            <span className="font-black text-sm tracking-[0.1em] dark:text-white text-slate-900 uppercase italic">DJIB-AUTO</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 -mt-12 relative z-10 pb-12">
        <div className={`p-6 rounded-3xl shadow-xl border mb-6 text-center transition-all duration-500 ${isAdminMode ? 'bg-slate-900 border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
          <h2 className={`text-2xl font-black ${isAdminMode ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {isAdminMode ? 'Accès Vendeur' : 'Espace Client'}
          </h2>
          <p className="text-xs mt-1 text-slate-400">Authentification sécurisée Marketplace</p>
        </div>

        <div className="flex w-full mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-12 shadow-inner">
          <button onClick={() => setIsAdminMode(false)} className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isAdminMode ? 'bg-white dark:bg-slate-700 shadow-md text-primary' : 'text-slate-400'}`}>Acheteur</button>
          <button onClick={() => setIsAdminMode(true)} className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAdminMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Vendeur</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isAdminMode ? (
            <>
              <input className="w-full h-12 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-bold" placeholder="Nom complet" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              {isRegisterMode && <input className="w-full h-12 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-bold" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}
              <input className="w-full h-12 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-bold" placeholder="Téléphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </>
          ) : (
            <div className="relative">
              <input className="w-full h-12 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-bold tracking-widest" placeholder="Code secret" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-0 h-full text-slate-400"><span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span></button>
            </div>
          )}
          <button type="submit" disabled={loading} className={`w-full h-14 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-lg ${isAdminMode ? 'bg-slate-900 text-white' : 'bg-primary text-white'}`}>
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
          {!isAdminMode && (
            <button type="button" onClick={() => setIsRegisterMode(!isRegisterMode)} className="text-[10px] font-black text-primary uppercase text-center mt-2">
              {isRegisterMode ? "Déjà un compte ? Connexion" : "Nouveau ? Créer un compte"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
