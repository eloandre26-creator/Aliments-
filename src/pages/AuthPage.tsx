import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { DEMO_USERS } from '../data/mockProducts';
import {
  UserCheck,
  Sprout,
  ShoppingBag,
  Phone,
  MessageSquare,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<UserRole>('producer');

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [locationOrCity, setLocationOrCity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register') {
      if (!name.trim() || !phone.trim() || !locationOrCity.trim() || !password.trim()) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      if (password.length < 4) {
        setError('Le mot de passe doit comporter au moins 4 caractères.');
        return;
      }

      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: name.trim(),
        role,
        phone: phone.trim(),
        whatsapp: (whatsapp.trim() || phone.trim()),
        cityOrLocation: locationOrCity.trim(),
        organizationType: role === 'producer' ? 'Producteur indépendant' : 'Acheteur',
      };

      onLogin(newUser);
      setSuccessMsg('Compte créé avec succès ! Bienvenue sur AgroLink Cameroun.');
    } else {
      // Login
      if (!phone.trim() || !password.trim()) {
        setError('Veuillez saisir votre numéro de téléphone et votre mot de passe.');
        return;
      }

      const existingUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: name.trim() || (role === 'producer' ? 'Producteur Partenaire' : 'Acheteur Yaoundé'),
        role,
        phone: phone.trim(),
        whatsapp: phone.trim(),
        cityOrLocation: locationOrCity.trim() || (role === 'producer' ? 'Obala (Lékié)' : 'Yaoundé'),
      };

      onLogin(existingUser);
      setSuccessMsg('Connexion réussie !');
    }
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    const demoUser = selectedRole === 'producer' ? DEMO_USERS.producer : DEMO_USERS.buyer;
    onLogin(demoUser);
    setSuccessMsg(`Connecté en tant que ${demoUser.name} (${selectedRole === 'producer' ? 'Producteur' : 'Acheteur'}) !`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* If already logged in */}
      {currentUser && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {currentUser.role === 'producer' ? '🌾' : '🛒'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 text-lg">
                  {currentUser.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {currentUser.role === 'producer' ? 'Producteur' : 'Acheteur'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                📞 {currentUser.phone} · 📍 {currentUser.cityOrLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-stone-300 hover:bg-white text-stone-700 text-xs font-bold rounded-xl transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden max-w-xl mx-auto">
        {/* Toggle Login / Register */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'register'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Créer un compte
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'login'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Se connecter
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick 1-Click Demo Buttons */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Test rapide en 1 clic (Comptes de démonstration) :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('producer')}
                className="p-2.5 bg-white hover:bg-emerald-50 border border-amber-200/80 rounded-xl text-left text-xs transition-colors flex items-center gap-2 group"
              >
                <span className="text-base">🌾</span>
                <div className="truncate">
                  <p className="font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                    Producteur (Obala)
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">Jean-Paul Nkoum</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('buyer')}
                className="p-2.5 bg-white hover:bg-emerald-50 border border-amber-200/80 rounded-xl text-left text-xs transition-colors flex items-center gap-2 group"
              >
                <span className="text-base">🛒</span>
                <div className="truncate">
                  <p className="font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                    Acheteur (Yaoundé)
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">Hôtel & Resto Le Mfoundi</p>
                </div>
              </button>
            </div>
          </div>

          {/* Role Selector: "Je suis producteur" vs "Je suis acheteur" */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
              Choisissez votre profil :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('producer')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                  role === 'producer'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-700/20'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌾</span>
                  <span className="text-xs sm:text-sm font-extrabold">Je suis producteur</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  Agriculteur, planteur ou coopérative vendant des récoltes.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                  role === 'buyer'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-700/20'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛒</span>
                  <span className="text-xs sm:text-sm font-extrabold">Je suis acheteur</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  Grossiste, restaurateur, hôtel ou commerçant de Yaoundé.
                </p>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {role === 'producer' ? 'Nom ou Nom de la Coopérative *' : 'Nom ou Nom de votre Établissement *'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'producer' ? 'Ex : Jean-Paul Nkoum ou GIC Lékié' : 'Ex : Restaurant Le Mfoundi'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required={activeTab === 'register'}
                />
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Numéro de téléphone *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  required
                />
              </div>
            </div>

            {/* WhatsApp (only in register) */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Numéro WhatsApp (laisser vide si identique au téléphone)
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Location (Localité for producer, Ville for buyer) */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {role === 'producer' ? 'Localité de production *' : 'Ville ou quartier de résidence / commerce *'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationOrCity}
                    onChange={(e) => setLocationOrCity(e.target.value)}
                    placeholder={role === 'producer' ? 'Ex : Obala, Bafoussam, Sa’a...' : 'Ex : Yaoundé (Mokolo, Essos, Bastos)...'}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    required={activeTab === 'register'}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <span>{activeTab === 'register' ? 'Créer mon compte AgroLink' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
