import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Sprout,
  Menu,
  X,
  PlusCircle,
  ShoppingBag,
  Home,
  LayoutDashboard,
  UserCheck,
  LogIn,
  PhoneCall,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, productId?: string) => void;
  currentUser: UserProfile | null;
  onSwitchUser: (role: 'producer' | 'buyer') => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onSwitchUser,
  onResetData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'products', label: 'Produits', icon: ShoppingBag },
    { id: 'publish', label: 'Publier une offre', icon: PlusCircle },
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top emergency / Cameroon agricultural banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center flex items-center justify-between border-b border-emerald-800">
        <div className="hidden sm:flex items-center gap-2 mx-auto">
          <span className="font-semibold text-emerald-300">AgroLink Cameroun :</span>
          <span>Du champ au marché, sans perte. Yaoundé et bassins agricoles partenaires.</span>
        </div>
        <div className="sm:hidden text-center w-full font-medium">
          🇨🇲 AgroLink Cameroun — Du champ au marché, sans perte
        </div>
        <button
          onClick={onResetData}
          title="Réinitialiser les données de démonstration"
          className="text-[11px] text-emerald-300/80 hover:text-emerald-200 flex items-center gap-1 shrink-0 ml-2 underline underline-offset-2"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Données démo</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Slogan */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition-colors">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950 font-serif">
                  AgroLink
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                  Cameroun
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium hidden sm:block">
                Du champ au marché, sans perte.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Publish Button */}
            <button
              onClick={() => handleNavClick('publish')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-emerald-700/20 transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une offre</span>
            </button>

            {/* User Profile / Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {currentUser ? (currentUser.role === 'producer' ? '🌾' : '🛒') : '👤'}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-stone-900 truncate max-w-[120px]">
                    {currentUser ? currentUser.name.split(' ')[0] : 'Invité'}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {currentUser?.role === 'producer' ? 'Producteur' : currentUser?.role === 'buyer' ? 'Acheteur' : 'Non connecté'}
                  </p>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500">Connecté en tant que</p>
                    <p className="text-sm font-bold text-stone-900">{currentUser?.name}</p>
                    <p className="text-xs text-emerald-700 font-medium capitalize">
                      {currentUser?.role === 'producer' ? '🌾 Producteur agricole' : '🛒 Acheteur / Grossiste'}
                    </p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2 pt-1">
                      Changer de profil (Démo)
                    </p>
                    <button
                      onClick={() => {
                        onSwitchUser('producer');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        currentUser?.role === 'producer'
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>🌾 Mode Producteur (Jean-Paul N.)</span>
                      {currentUser?.role === 'producer' && <span className="text-emerald-700 text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchUser('buyer');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        currentUser?.role === 'buyer'
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>🛒 Mode Acheteur (Mme Fouda, Hôtel)</span>
                      {currentUser?.role === 'buyer' && <span className="text-emerald-700 text-xs">✓</span>}
                    </button>
                  </div>

                  <div className="border-t border-stone-100 p-2">
                    <button
                      onClick={() => {
                        handleNavClick('auth');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Gérer mon compte / Connexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('publish')}
              className="bg-emerald-700 text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* User status card mobile */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{currentUser?.role === 'producer' ? '🌾' : '🛒'}</span>
              <div>
                <p className="text-xs font-bold text-stone-900">{currentUser?.name}</p>
                <p className="text-[11px] text-emerald-700">
                  {currentUser?.role === 'producer' ? 'Producteur agricole' : 'Acheteur'} · {currentUser?.cityOrLocation}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onSwitchUser(currentUser?.role === 'producer' ? 'buyer' : 'producer')}
                className="text-[11px] bg-white border border-stone-300 px-2 py-1 rounded text-stone-700 font-medium"
              >
                Inverser rôle
              </button>
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('auth')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <LogIn className="w-5 h-5 text-stone-400" />
              <span>Connexion / Inscription</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Assistance directe Yaoundé :</span>
            <a
              href="tel:+237699451230"
              className="flex items-center gap-1 font-semibold text-emerald-800"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              +237 699 45 12 30
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
