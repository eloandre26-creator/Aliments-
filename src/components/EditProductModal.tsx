import React, { useState } from 'react';
import { ProductOffer, ProductCategory, ProductUnit, ProductStatus } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditProductModalProps {
  product: ProductOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ProductOffer>) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Fruits',
  'Légumes',
  'Céréales',
  'Tubercules',
  'Plantain',
  'Produits vivriers',
  'Autres'
];

const UNITS: ProductUnit[] = [
  'kg',
  'tonne',
  'sac de 50kg',
  'sac de 100kg',
  'régime',
  'cageot / casier',
  'filet',
  'seau'
];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !product) return null;

  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState<ProductCategory>(product.category);
  const [description, setDescription] = useState(product.description);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [unit, setUnit] = useState<ProductUnit>(product.unit);
  const [pricePerUnit, setPricePerUnit] = useState(product.pricePerUnit.toString());
  const [location, setLocation] = useState(product.location);
  const [harvestDate, setHarvestDate] = useState(product.harvestDate);
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !quantity || !pricePerUnit || !location.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const qNum = parseFloat(quantity);
    const pNum = parseFloat(pricePerUnit);
    if (isNaN(qNum) || qNum <= 0 || isNaN(pNum) || pNum <= 0) {
      setError('La quantité et le prix unitaire doivent être des nombres supérieurs à zéro.');
      return;
    }

    onSave(product.id, {
      title: title.trim(),
      category,
      description: description.trim(),
      quantity: qNum,
      unit,
      pricePerUnit: pNum,
      location: location.trim(),
      harvestDate: harvestDate.trim(),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <h2 className="text-base font-bold text-stone-900">
            Modifier l'annonce agricole
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nom du produit / variété *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Statut de disponibilité
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-medium"
              >
                <option value="Disponible">🟢 Disponible (en vente)</option>
                <option value="Vendu">⚪ Vendu (stock épuisé)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quantité restante *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Unité de mesure *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as ProductUnit)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Prix unitaire (FCFA / {unit}) *
            </label>
            <input
              type="number"
              min="1"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Localisation *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Date ou délai de disponibilité *
            </label>
            <input
              type="text"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
