import React from 'react';
import { ProductOffer } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  ShieldCheck,
  Scale,
  Banknote,
  Share2,
  Check,
  AlertTriangle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductOffer | null;
  onClose: () => void;
  onSelectAnother?: (product: ProductOffer) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!product) return null;

  const isAvailable = product.status === 'Disponible';
  const cleanPhone = product.producerWhatsApp.replace(/[^0-9]/g, '');
  const totalPrice = product.quantity * product.pricePerUnit;

  const waMessage = encodeURIComponent(
    `Bonjour ${product.producerName}, je vous contacte sur AgroLink Cameroun à propos de votre offre :\n\n` +
      `📦 *Produit* : ${product.title}\n` +
      `⚖️ *Quantité* : ${product.quantity} ${product.unit}\n` +
      `💰 *Prix* : ${product.pricePerUnit} FCFA / ${product.unit}\n` +
      `📍 *Localisation* : ${product.location}\n\n` +
      `Est-ce toujours disponible pour acheminement ou enlèvement vers Yaoundé ?`
  );

  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title + ' — AgroLink Cameroun',
        text: `Offre agricole : ${product.title} (${product.quantity} ${product.unit} à ${product.pricePerUnit} FCFA) à ${product.location}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {product.category}
            </span>
            <span className="text-xs text-stone-500">
              Réf : {product.id} · {product.viewsCount} consultations
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-full transition-colors"
              title="Partager cette annonce"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Photo Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Status overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md flex items-center gap-1.5 ${
                  isAvailable
                    ? 'bg-emerald-900/95 text-white'
                    : 'bg-stone-900/90 text-stone-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                  }`}
                />
                {product.status}
              </span>

              {product.isUrgent && isAvailable && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 text-white shadow-sm flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Récolte fraîche à écouler vite
                </span>
              )}
            </div>
          </div>

          {/* Title & Key Pricing Card */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
              {product.title}
            </h1>

            {/* Quick Metrics Bar */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div>
                <span className="text-xs text-stone-500 block">Prix unitaire</span>
                <span className="text-lg font-bold text-emerald-800">
                  {product.pricePerUnit.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-xs text-stone-500 block">par {product.unit}</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Quantité disponible</span>
                <span className="text-lg font-bold text-stone-900">
                  {product.quantity.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs text-stone-500 block">{product.unit}</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Valeur estimée</span>
                <span className="text-base font-bold text-stone-800">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-xs text-stone-400 block">lot complet</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block">Statut actuel</span>
                <span className={`text-sm font-bold ${isAvailable ? 'text-emerald-700' : 'text-stone-500'}`}>
                  {product.status}
                </span>
                <span className="text-xs text-stone-400 block">Mise à jour récente</span>
              </div>
            </div>
          </div>

          {/* Details & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 bg-stone-50/60 rounded-xl border border-stone-100">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-stone-900">Localisation de la récolte</p>
                <p className="text-sm text-stone-700">{product.location}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Bassin approvisionnant Yaoundé ({product.region || 'Cameroun'})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-stone-50/60 rounded-xl border border-stone-100">
              <Calendar className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-stone-900">Disponibilité</p>
                <p className="text-sm text-stone-700">{product.harvestDate}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Publié le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Description détaillée de la récolte
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
              {product.description}
            </p>
          </div>

          {/* Producer Contact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-base">
                  🌾
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-emerald-950 text-base">
                      {product.producerName}
                    </h4>
                    <span title="Producteur vérifié AgroLink">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Producteur local enregistré · {product.location}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded">
                Contact direct sans commission
              </span>
            </div>

            {/* Direct Phone display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-emerald-200/80">
              <div className="text-xs">
                <span className="text-stone-500 block">Numéro de contact officiel :</span>
                <span className="font-mono font-bold text-stone-900 text-sm tracking-wide">
                  {product.producerPhone}
                </span>
              </div>
              <div className="text-xs text-stone-500">
                <span>WhatsApp actif : </span>
                <span className="font-semibold text-emerald-800">{product.producerWhatsApp}</span>
              </div>
            </div>

            {/* The TWO Mandatory Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${product.producerPhone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-emerald-700 hover:bg-emerald-100/70 text-emerald-900 font-bold text-sm transition-all text-center shadow-xs active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-emerald-800" />
                <span>Appeler le producteur</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all text-center shadow-md shadow-emerald-700/20 active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contacter sur WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-stone-500 text-center">
              💡 Astuce : Convenez directement des modalités d'enlèvement (au champ ou livraison sur Yaoundé).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 py-2 px-3 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            Fermer l'annonce
          </button>
          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Ouvrir WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
