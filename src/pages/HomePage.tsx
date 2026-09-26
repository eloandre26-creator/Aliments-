import React, { useState } from 'react';
import { ProductOffer } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Sprout,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Truck,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HomePageProps {
  products: ProductOffer[];
  onNavigate: (page: string, categoryOrQuery?: string) => void;
  onSelectProduct: (product: ProductOffer) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onNavigate,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('products', searchQuery);
  };

  // 4 most recent available products
  const recentProducts = products
    .filter((p) => p.status === 'Disponible')
    .slice(0, 4);

  const categories = [
    { label: 'Tomates & Légumes', query: 'Légumes', icon: '🍅' },
    { label: 'Régimes de Plantain', query: 'Plantain', icon: '🍌' },
    { label: 'Tubercules (Manioc, PdT)', query: 'Tubercules', icon: '🥔' },
    { label: 'Céréales (Maïs)', query: 'Céréales', icon: '🌽' },
    { label: 'Fruits frais', query: 'Fruits', icon: '🥑' },
    { label: 'Produits vivriers', query: 'Produits vivriers', icon: '🥜' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tagline / Subtitle */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>La première marketplace directe agricole du Cameroun</span>
            </div>

            {/* Main Title & Slogan */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
              AgroLink Cameroun
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-300 font-serif italic">
              « Du champ au marché, sans perte. »
            </p>

            {/* Problem & Solution Short Statement */}
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-normal">
              Au Cameroun, près de 40% des récoltes périssables se gâtent au champ par manque d'acheteurs immédiats.
              <strong className="text-white font-semibold"> AgroLink connecte directement les producteurs locaux aux grossistes, restaurants et commerçants de Yaoundé</strong> pour vendre vos stocks avant qu'il ne soit trop tard.
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 sm:mt-8 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-emerald-500/30"
            >
              <div className="flex items-center gap-2 px-3 flex-1 w-full text-stone-800">
                <Search className="w-5 h-5 text-emerald-700 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Que cherchez-vous ? (Tomates, Plantain, Maïs, Obala, Bafoussam...)"
                  className="w-full py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs">
              <span className="text-emerald-200/70 text-[11px] mr-1">Populaire :</span>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.query}
                  onClick={() => onNavigate('products', cat.query)}
                  className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-3 py-1 rounded-lg border border-emerald-700/50 transition-colors text-xs flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Dual Core CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <button
                onClick={() => onNavigate('publish')}
                className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>🌾 Je suis producteur</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl bg-white hover:bg-stone-100 text-emerald-950 font-extrabold text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>🛒 Je cherche des produits</span>
              </button>
            </div>
          </div>
        </div>

        {/* Corridor bar */}
        <div className="mt-12 sm:mt-16 border-t border-emerald-800/80 bg-emerald-950/60 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-emerald-200">
            <span className="font-semibold text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Zone de lancement prioritaire :
            </span>
            <span>Grand Yaoundé (Mokolo, Mfoundi, Essos)</span>
            <span className="hidden sm:inline">·</span>
            <span>Lékié (Obala, Sa'a)</span>
            <span className="hidden sm:inline">·</span>
            <span>Ouest (Bafoussam, Mbouda, Foumban)</span>
            <span className="hidden sm:inline">·</span>
            <span>Nord-Ouest (Santa, Bamenda)</span>
          </div>
        </div>
      </section>

      {/* 2. PRODUITS RÉCEMMENT PUBLIÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Arrivages en direct des plantations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              Produits récemment publiés
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Récoltes disponibles en ce moment, prêtes pour expédition ou enlèvement.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0"
          >
            <span>Voir toute la marketplace ({products.length} offres)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => onNavigate('products')}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
          >
            Voir tous les produits disponibles
          </button>
        </div>
      </section>

      {/* 3. COMMENT FONCTIONNE AGROLINK (3 ÉTAPES CLAIRES) */}
      <section className="bg-stone-100/80 py-16 sm:py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Simple · Rapide · Efficace
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3 font-serif">
              Comment fonctionne AgroLink Cameroun ?
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Une plateforme pensée pour être comprise en moins d'une minute, même sur un simple smartphone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mb-5">
                  1
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  Le producteur publie sa récolte
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Avant même de récolter ou dès la fin de la cueillette, l'agriculteur indique sa quantité disponible (ex: 500 kg de tomates à Bafoussam ou 1200 kg de manioc à Obala) avec son prix en FCFA.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span>Sans frais d'inscription</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-lg flex items-center justify-center mb-5">
                  2
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  L'acheteur trouve les produits frais
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Grossistes des marchés Mokolo et Mfoundi, gérants de restaurants, transformateurs et ménages consultent les offres en temps réel et filtrent par région et par prix.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <span>Prix direct champ sans spéculation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center mb-5">
                  3
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  Mise en relation directe & Vente
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  En un clic, l'acheteur appelle le producteur ou démarre une discussion WhatsApp. Ils s'accordent sur le transport vers Yaoundé et le paiement. Zéro perte !
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <span>Appel téléphonique & WhatsApp direct</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LE PROBLÈME & LA SOLUTION (CONTEXTE CAMEROUNAIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-12 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                La mission d'AgroLink au Cameroun
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-white">
                Halte au gaspillage post-récolte dans nos campagnes !
              </h2>
              <p className="text-emerald-100/90 text-sm leading-relaxed">
                Chaque saison, des dizaines de tonnes de tomates à Foumbot ou Bafoussam, de plantains à Mbouda et de tubercules dans la Lékié pourrissent au bord des routes parce que le paysan n'a pas trouvé de camionneur ou d'acheteur au jour J.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-stone-300">
                    <strong className="text-white">Le problème :</strong> Pertes financières massives pour les petits producteurs, découragement de la jeunesse agricole et hausse artificielle des prix sur les marchés de Yaoundé.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-stone-300">
                    <strong className="text-white">La solution AgroLink :</strong> Une visibilité immédiate en amont de la récolte. Les grossistes réservent les lots avant même que le produit ne prenne la route.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/60 p-6 sm:p-8 rounded-2xl border border-emerald-700/60 space-y-5">
              <h3 className="text-lg font-bold text-amber-300 font-serif">
                Notre engagement pour Yaoundé & ses bassins
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-emerald-100">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>100% sans commission cachée</strong> sur le prix du kilo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>Accessible avec WhatsApp</strong>, l'outil que chaque planteur utilise déjà.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>Soutien aux coopératives locales</strong> de la Lékié et de l'Ouest.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('publish')}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
                >
                  Publier une récolte maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AVANTAGES PRODUCTEURS & ACHETEURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Pourquoi choisir AgroLink ?
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Des bénéfices concrets et mesurables pour chaque acteur de la chaîne alimentaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pour les Producteurs */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl">
                🌾
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Agriculteurs & Coopératives
                </span>
                <h3 className="text-xl font-bold text-emerald-950">
                  Avantages pour les producteurs
                </h3>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Zéro vente à perte par désespoir :</strong> Trouvez un acquéreur avant la maturité complète pour ne plus devoir brader vos sacs à vil prix.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Accès direct aux gros acheteurs de Yaoundé :</strong> Hôtels, traiteurs, supermarchés et grossistes sans intermédiaires abusifs ("coxeurs").
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Prise de contact instantanée :</strong> Les acheteurs vous joignent directement par téléphone ou sur WhatsApp en 1 clic.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Tableau de bord de suivi :</strong> Marquez vos annonces comme vendues et suivez le nombre de vues de vos stocks.
                </span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('publish')}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
            >
              Je publie mon offre de récolte
            </button>
          </div>

          {/* Pour les Acheteurs */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl">
                🛒
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Grossistes, Hôtels & Restaurateurs
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  Avantages pour les acheteurs
                </h3>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Fraîcheur maximale garantie :</strong> Produits récoltés le jour même ou sous 24h, directement depuis les plantations de la Lékié et de l'Ouest.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Meilleurs tarifs en FCFA :</strong> Achetez au juste prix producteur sans surcoût d'intermédiaires multiples.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Approvisionnement régulier et fiable :</strong> Anticipez les ruptures de stocks pour votre restaurant ou votre commerce.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Traçabilité locale :</strong> Vous connaissez exactement l'agriculteur et la localité d'où provient chaque aliment.
                </span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('products')}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
            >
              Consulter les produits disponibles
            </button>
          </div>
        </div>
      </section>

      {/* 6. SUPPORT & CALL-IN HELPLINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Vous êtes agriculteur et avez du mal avec Internet ?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Notre équipe à Yaoundé peut enregistrer votre offre gratuitement par téléphone ou WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+237699451230"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Appeler : +237 699 45 12 30</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
