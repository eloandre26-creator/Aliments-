import React from 'react';
import { ProductOffer } from '../types';
import { MapPin, Calendar, Phone, MessageSquare, ArrowUpRight, Scale } from 'lucide-react';

interface ProductCardProps {
  product: ProductOffer;
  onSelect: (product: ProductOffer) => void;
  onCall?: (product: ProductOffer, e: React.MouseEvent) => void;
  onWhatsApp?: (product: ProductOffer, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const isAvailable = product.status === 'Disponible';

  // Format clean phone for WhatsApp
  const cleanPhone = product.producerWhatsApp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Bonjour ${product.producerName}, je vous contacte via AgroLink Cameroun concernant votre offre de : "${product.title}" (${product.quantity} ${product.unit} à ${product.pricePerUnit} FCFA/${product.unit} à ${product.location}). Est-elle toujours disponible ?`
  )}`;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Clean status tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md flex items-center gap-1.5 ${
              isAvailable
                ? 'bg-emerald-900/90 text-white'
                : 'bg-stone-800/85 text-stone-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'
              }`}
            />
            {product.status}
          </span>

          {product.isUrgent && isAvailable && (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-amber-600/95 text-white backdrop-blur-md shadow-xs">
              Vente urgente
            </span>
          )}
        </div>

        {/* Category indicator quiet text in corner */}
        <div className="absolute bottom-3 left-3 bg-stone-950/70 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
          {product.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata line with separators (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-stone-700">{product.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{product.region || 'Cameroun'}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Quantity & Location */}
          <div className="mt-2.5 space-y-1 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                Quantité : <strong className="text-stone-900 font-semibold">{product.quantity.toLocaleString('fr-FR')} {product.unit}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{product.harvestDate}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-stone-500 block">Prix unitaire</span>
              <span className="text-lg font-extrabold text-emerald-800">
                {product.pricePerUnit.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-xs text-stone-500 font-medium"> /{product.unit}</span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-stone-400 block">Valeur du lot</span>
              <span className="text-xs font-semibold text-stone-700">
                {(product.quantity * product.pricePerUnit).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <a
              href={`tel:${product.producerPhone}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 text-xs font-semibold transition-colors active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Appeler</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="w-full mt-2 text-center text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center justify-center gap-1 py-1"
          >
            <span>Voir tous les détails</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
