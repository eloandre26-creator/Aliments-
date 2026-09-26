import React, { useState } from 'react';
import { ProductOffer, UserProfile } from '../types';
import { EditProductModal } from '../components/EditProductModal';
import {
  LayoutDashboard,
  CheckCircle,
  Eye,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface ProducerDashboardPageProps {
  products: ProductOffer[];
  currentUser: UserProfile | null;
  onUpdateProduct: (id: string, updates: Partial<ProductOffer>) => void;
  onDeleteProduct: (id: string) => void;
  onNavigatePublish: () => void;
  onSelectProduct: (product: ProductOffer) => void;
}

export const ProducerDashboardPage: React.FC<ProducerDashboardPageProps> = ({
  products,
  currentUser,
  onUpdateProduct,
  onDeleteProduct,
  onNavigatePublish,
  onSelectProduct,
}) => {
  const [editingProduct, setEditingProduct] = useState<ProductOffer | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Disponible' | 'Vendu'>('all');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Producer listings: for demo flexibility, if user has specific producerId, filter by it,
  // or show their listings plus general user listings
  const producerOffers = products.filter((p) => {
    if (currentUser?.role === 'producer') {
      return p.producerId === currentUser.id || p.producerId === 'user-prod-1';
    }
    // If buyer visits dashboard, allow viewing demo producer offers with informative banner
    return true;
  });

  // Calculate dashboard stats
  const activeOffersCount = producerOffers.filter((p) => p.status === 'Disponible').length;
  const soldOffersCount = producerOffers.filter((p) => p.status === 'Vendu').length;
  const totalViewsCount = producerOffers.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalStockValue = producerOffers
    .filter((p) => p.status === 'Disponible')
    .reduce((acc, curr) => acc + curr.quantity * curr.pricePerUnit, 0);

  const displayedOffers = producerOffers.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const handleToggleSold = (offer: ProductOffer) => {
    const nextStatus = offer.status === 'Disponible' ? 'Vendu' : 'Disponible';
    onUpdateProduct(offer.id, { status: nextStatus });
  };

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
    setDeleteConfirmationId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Espace de gestion agricole</span>
            <span>·</span>
            <span>{currentUser?.name || 'Producteur local'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Tableau de bord Producteur
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Gérez la disponibilité de vos stocks, mettez à jour vos prix et suivez l'intérêt des acheteurs.
          </p>
        </div>

        <button
          onClick={onNavigatePublish}
          className="self-start sm:self-auto flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publier une nouvelle récolte</span>
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Offres Actives */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Offres actives</span>
            <span className="text-2xl font-extrabold text-stone-900">{activeOffersCount}</span>
            <span className="text-[11px] text-emerald-700 block">En vente sur la marketplace</span>
          </div>
        </div>

        {/* Stat 2: Offres Vendues */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Offres vendues</span>
            <span className="text-2xl font-extrabold text-stone-900">{soldOffersCount}</span>
            <span className="text-[11px] text-stone-500 block">Stocks écoulés sans perte</span>
          </div>
        </div>

        {/* Stat 3: Total Consultations */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Total consultations</span>
            <span className="text-2xl font-extrabold text-stone-900">{totalViewsCount}</span>
            <span className="text-[11px] text-amber-700 block">Vues par les acheteurs</span>
          </div>
        </div>

        {/* Stat 4: Valeur Stock Actif */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 block font-medium">Valeur stock actif</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-800">
              {totalStockValue.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-[11px] text-stone-500 block">Prix estimé cumulé</span>
          </div>
        </div>
      </div>

      {/* OFFERS MANAGEMENT TABLE & CARDS */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Table Filter Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Vos offres de récoltes ({producerOffers.length})
            </h2>
            <p className="text-xs text-stone-500">
              Modifiez vos annonces ou marquez-les comme vendues dès qu'un acheteur confirme l'enlèvement.
            </p>
          </div>

          {/* Status filter buttons */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Toutes ({producerOffers.length})
            </button>
            <button
              onClick={() => setFilterStatus('Disponible')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'Disponible'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Disponibles ({activeOffersCount})
            </button>
            <button
              onClick={() => setFilterStatus('Vendu')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'Vendu'
                  ? 'bg-white text-stone-700 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Vendues ({soldOffersCount})
            </button>
          </div>
        </div>

        {/* Offers List */}
        {displayedOffers.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {displayedOffers.map((offer) => {
              const isAvailable = offer.status === 'Disponible';
              return (
                <div
                  key={offer.id}
                  className="p-4 sm:p-6 hover:bg-stone-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAvailable ? 'bg-emerald-600' : 'bg-stone-500'
                            }`}
                          />
                          {offer.status}
                        </span>

                        <span className="text-xs text-stone-500">·</span>
                        <span className="text-xs font-medium text-stone-500">
                          {offer.category}
                        </span>

                        <span className="text-xs text-stone-500">·</span>
                        <span className="text-xs text-amber-700 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{offer.viewsCount} vues</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(offer)}
                        className="text-sm sm:text-base font-bold text-stone-900 hover:text-emerald-700 cursor-pointer"
                      >
                        {offer.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                        <span>
                          Stock : <strong className="text-stone-900">{offer.quantity} {offer.unit}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Prix : <strong className="text-emerald-800">{offer.pricePerUnit.toLocaleString('fr-FR')} FCFA</strong> / {offer.unit}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {offer.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    {/* View details */}
                    <button
                      onClick={() => onSelectProduct(offer)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      title="Voir l'annonce publique"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>

                    {/* Toggle Status (Disponible / Vendu) */}
                    <button
                      onClick={() => handleToggleSold(offer)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                        isAvailable
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                      title={isAvailable ? 'Marquer comme vendu' : 'Remettre en vente'}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Marquer vendu</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Remettre en vente</span>
                        </>
                      )}
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => setEditingProduct(offer)}
                      className="px-3 py-2 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-stone-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>

                    {/* Delete button */}
                    {deleteConfirmationId === offer.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                        <span className="text-[11px] text-red-700 font-semibold px-1">Confirmer ?</span>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded"
                        >
                          Oui
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-[11px] font-bold rounded"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmationId(offer.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer cette offre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl">
              📦
            </div>
            <p className="text-sm font-semibold text-stone-700">
              Aucune offre trouvée avec ce filtre.
            </p>
            <button
              onClick={onNavigatePublish}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
            >
              Publier votre première récolte
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={onUpdateProduct}
      />
    </div>
  );
};
