import React, { useState, useMemo } from 'react';
import { ProductOffer, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  CheckCircle2,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';

interface ProductsPageProps {
  products: ProductOffer[];
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: ProductOffer) => void;
  onNavigatePublish: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Toutes les catégories', value: 'all' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Légumes', value: 'Légumes' },
  { label: 'Céréales', value: 'Céréales' },
  { label: 'Tubercules', value: 'Tubercules' },
  { label: 'Plantain', value: 'Plantain' },
  { label: 'Produits vivriers', value: 'Produits vivriers' },
  { label: 'Autres', value: 'Autres' },
];

const LOCATIONS = [
  'Toutes les localités',
  'Yaoundé',
  'Obala (Lékié)',
  'Bafoussam',
  'Mbouda (Bamboutos)',
  'Foumban (Noun)',
  'Bamenda (Santa)',
  'Sa’a (Lékié)',
  'Ntui (Haute-Sanaga)',
  'Bafia (Mbam)',
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialCategory = '',
  initialSearch = '',
  onSelectProduct,
  onNavigatePublish,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'all'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('Toutes les localités');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'sold'>('available');
  const [sortBy, setSortBy] = useState<'recent' | 'priceAsc' | 'priceDesc'>('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term (name, description, location)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(term);
          const matchDesc = p.description.toLowerCase().includes(term);
          const matchLoc = p.location.toLowerCase().includes(term);
          const matchCategory = p.category.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc && !matchLoc && !matchCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        // Location filter
        if (selectedLocation !== 'Toutes les localités') {
          const locBase = selectedLocation.split(' ')[0].toLowerCase();
          if (!p.location.toLowerCase().includes(locBase)) return false;
        }

        // Availability filter
        if (selectedAvailability === 'available' && p.status !== 'Disponible') {
          return false;
        }
        if (selectedAvailability === 'sold' && p.status !== 'Vendu') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'priceDesc') return b.pricePerUnit - a.pricePerUnit;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchTerm, selectedCategory, selectedLocation, selectedAvailability, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('Toutes les localités');
    setSelectedAvailability('all');
    setSortBy('recent');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'Toutes les localités' ||
    selectedAvailability !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Marketplace Agricole</span>
            <span>·</span>
            <span>Yaoundé & Bassins d'approvisionnement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
            Produits agricoles disponibles
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Consultez les récoltes fraîches, comparez les prix en FCFA et contactez directement les producteurs sans intermédiaire.
          </p>
        </div>

        <button
          onClick={onNavigatePublish}
          className="self-start md:self-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <span>🌾 Vous récoltez ? Publiez ici</span>
        </button>
      </div>

      {/* Main Search and Quick Filters Bar */}
      <div className="space-y-4">
        {/* Search input + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit (Tomate, Plantain, Manioc, Pomme de terre...)"
              className="w-full pl-11 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort selector */}
            <div className="relative flex items-center bg-white border border-stone-300 rounded-xl px-3 py-2.5 shadow-xs text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier les offres"
                className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent">Plus récents d'abord</option>
                <option value="priceAsc">Prix croissant (FCFA)</option>
                <option value="priceDesc">Prix décroissant (FCFA)</option>
              </select>
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-800 px-3 py-2.5 rounded-xl text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Selector (Interactive Segmented buttons, conforming to Zero-pill discipline) */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max p-1 bg-stone-100 rounded-xl border border-stone-200">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location & Availability Filters Row (Desktop + Expandable Mobile) */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 ${
            showMobileFilters ? 'block' : 'hidden sm:grid'
          }`}
        >
          {/* Location filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Bassin / Localisation
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Disponibilité du stock
            </label>
            <div className="flex bg-white border border-stone-300 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setSelectedAvailability('available')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  selectedAvailability === 'available'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setSelectedAvailability('all')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  selectedAvailability === 'all'
                    ? 'bg-stone-800 text-white font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedAvailability('sold')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  selectedAvailability === 'sold'
                    ? 'bg-stone-600 text-white font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Vendus
              </button>
            </div>
          </div>

          {/* Reset button & Results count */}
          <div className="flex items-end justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-stone-200 transition-colors font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}

            <div className="text-right text-xs font-semibold text-stone-700 self-center">
              <span>{filteredProducts.length}</span> offre{filteredProducts.length > 1 ? 's' : ''} trouvée{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Product Listings Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-2xl flex items-center justify-center mx-auto">
            🌾
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            Aucun produit ne correspond à ces critères
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Essayez de modifier votre recherche ou de changer de bassin agricole (ex: Bafoussam, Obala, Mbouda).
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Afficher toutes les récoltes
            </button>
            <button
              onClick={onNavigatePublish}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Publier ce produit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
