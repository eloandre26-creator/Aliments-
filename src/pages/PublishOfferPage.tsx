import React, { useState } from 'react';
import { ProductCategory, ProductUnit, ProductOffer, UserProfile } from '../types';
import { PRESET_IMAGES } from '../data/mockProducts';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Plus
} from 'lucide-react';

interface PublishOfferPageProps {
  currentUser: UserProfile | null;
  onPublish: (offer: Omit<ProductOffer, 'id' | 'viewsCount' | 'createdAt'>) => ProductOffer;
  onNavigate: (page: string, productId?: string) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Légumes',
  'Plantain',
  'Tubercules',
  'Céréales',
  'Fruits',
  'Produits vivriers',
  'Autres'
];

const UNITS: { label: string; value: ProductUnit }[] = [
  { label: 'Kilogrammes (kg)', value: 'kg' },
  { label: 'Tonnes (1000 kg)', value: 'tonne' },
  { label: 'Sacs de 100 kg', value: 'sac de 100kg' },
  { label: 'Sacs de 50 kg', value: 'sac de 50kg' },
  { label: 'Régimes', value: 'régime' },
  { label: 'Cageots / Casiers', value: 'cageot / casier' },
  { label: 'Filets', value: 'filet' },
  { label: 'Seaux', value: 'seau' },
];

const REGIONS_PRESETS = [
  'Obala (Lékié, Centre)',
  'Sa’a (Lékié, Centre)',
  'Bafoussam (Ouest)',
  'Mbouda (Bamboutos, Ouest)',
  'Foumban (Noun, Ouest)',
  'Santa / Bamenda (Nord-Ouest)',
  'Ntui (Haute-Sanaga, Centre)',
  'Bafia (Mbam-et-Inoubou, Centre)',
  'Yaoundé et périphérie',
];

export const PublishOfferPage: React.FC<PublishOfferPageProps> = ({
  currentUser,
  onPublish,
  onNavigate,
}) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Légumes');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState(currentUser?.cityOrLocation || 'Obala (Lékié)');
  const [harvestDate, setHarvestDate] = useState('Disponible immédiatement');
  const [producerName, setProducerName] = useState(currentUser?.name || 'Jean-Paul Nkoum');
  const [producerPhone, setProducerPhone] = useState(currentUser?.phone || '+237699451230');
  const [producerWhatsApp, setProducerWhatsApp] = useState(currentUser?.whatsapp || '+237699451230');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isUrgent, setIsUrgent] = useState(false);

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdProduct, setCreatedProduct] = useState<ProductOffer | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(PRESET_IMAGES[0].url);

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'La photo ne doit pas dépasser 5 Mo.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.image;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Veuillez saisir le nom du produit agricole.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Le nom du produit est trop court (min. 3 caractères).';
    }

    const qNum = parseFloat(quantity);
    if (!quantity || isNaN(qNum) || qNum <= 0) {
      newErrors.quantity = 'Veuillez indiquer une quantité valide supérieure à 0.';
    }

    const pNum = parseFloat(pricePerUnit);
    if (!pricePerUnit || isNaN(pNum) || pNum <= 0) {
      newErrors.pricePerUnit = 'Veuillez indiquer un prix unitaire en FCFA supérieur à 0.';
    }

    if (!location.trim()) {
      newErrors.location = 'Veuillez indiquer la localisation exacte de votre champ ou entrepôt.';
    }

    if (!harvestDate.trim()) {
      newErrors.harvestDate = 'Veuillez spécifier la date ou délai de disponibilité.';
    }

    if (!producerName.trim()) {
      newErrors.producerName = 'Le nom du producteur ou de la coopérative est requis.';
    }

    if (!producerPhone.trim()) {
      newErrors.producerPhone = 'Un numéro de téléphone appelable est obligatoire.';
    } else if (producerPhone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.producerPhone = 'Le numéro de téléphone semble invalide (ex: +237 699 45 12 30).';
    }

    if (!producerWhatsApp.trim()) {
      newErrors.producerWhatsApp = 'Le numéro WhatsApp est obligatoire pour la prise de contact rapide.';
    }

    if (!imageUrl) {
      newErrors.image = 'Veuillez choisir ou charger une photo pour votre produit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // Determine region helper
    let detectedRegion = 'Centre';
    const locLower = location.toLowerCase();
    if (locLower.includes('bafoussam') || locLower.includes('mbouda') || locLower.includes('foumban') || locLower.includes('ouest')) {
      detectedRegion = 'Ouest';
    } else if (locLower.includes('bamenda') || locLower.includes('santa') || locLower.includes('nord-ouest')) {
      detectedRegion = 'Nord-Ouest';
    } else if (locLower.includes('yaoundé') || locLower.includes('obala') || locLower.includes('sa’a') || locLower.includes('ntui') || locLower.includes('bafia')) {
      detectedRegion = 'Centre';
    }

    const newOffer = onPublish({
      title: title.trim(),
      category,
      description: description.trim() || `Produit frais directement récolté à ${location}. Prêt pour expédition vers Yaoundé.`,
      quantity: parseFloat(quantity),
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      location: location.trim(),
      region: detectedRegion,
      harvestDate: harvestDate.trim(),
      status: 'Disponible',
      imageUrl,
      producerId: currentUser?.id || 'user-prod-1',
      producerName: producerName.trim(),
      producerPhone: producerPhone.trim(),
      producerWhatsApp: producerWhatsApp.trim(),
      isUrgent,
    });

    setCreatedProduct(newOffer);
  };

  // If successfully published, show confirmation screen as requested
  if (createdProduct) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Succès de la mise en ligne
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              Votre offre est publiée avec succès !
            </h1>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Votre récolte de <strong className="text-stone-900">{createdProduct.title}</strong> est désormais visible par tous les grossistes, acheteurs et restaurateurs de Yaoundé.
            </p>
          </div>

          {/* Quick summary ticket */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-stone-500">Stock mis en vente :</span>
              <span className="font-bold text-stone-900">{createdProduct.quantity} {createdProduct.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Prix unitaire :</span>
              <span className="font-bold text-emerald-800">{createdProduct.pricePerUnit.toLocaleString('fr-FR')} FCFA / {createdProduct.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Localisation :</span>
              <span className="font-semibold text-stone-800">{createdProduct.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact d'appel :</span>
              <span className="font-mono font-semibold text-stone-800">{createdProduct.producerPhone}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('products')}
              className="py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Voir dans la marketplace</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <span>Aller au tableau de bord</span>
            </button>

            <button
              onClick={() => {
                setCreatedProduct(null);
                setTitle('');
                setQuantity('');
                setPricePerUnit('');
                setDescription('');
              }}
              className="py-3 px-6 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publier une autre offre</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title block */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <span>Espace Producteurs & Coopératives</span>
          <span>·</span>
          <span>Cameroun</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          Publier une offre de récolte
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Renseignez votre stock disponible. Les acheteurs de Yaoundé (grossistes, marchés, restaurants) vous contacteront directement sans intermédiaire.
        </p>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
      >
        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: PRODUIT & CATÉGORIE */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Identification du produit</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Nom du produit et variété *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Tomates fraîches de plein champ (Variété Cobra)"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                    errors.title ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Description du produit et qualité
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez la maturité, le mode d'emballage (cageots, sacs), l'état sanitaire, les conditions d'enlèvement..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* SECTION 2: QUANTITÉ ET PRIX EN FCFA */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Quantités et Prix en FCFA</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Quantité disponible *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex : 500"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold ${
                    errors.quantity ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.quantity}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Unité de mesure *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ProductUnit)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Prix unitaire (FCFA / {unit}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="Ex : 350"
                    className={`w-full pl-3.5 pr-14 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold text-emerald-900 ${
                      errors.pricePerUnit ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">
                    FCFA
                  </span>
                </div>
                {errors.pricePerUnit && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.pricePerUnit}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Total estimation banner */}
            {parseFloat(quantity) > 0 && parseFloat(pricePerUnit) > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-emerald-900">Valeur marchande totale estimée de votre lot :</span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {(parseFloat(quantity) * parseFloat(pricePerUnit)).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            )}
          </div>

          <hr className="border-stone-100" />

          {/* SECTION 3: LOCALISATION ET DISPONIBILITÉ */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
              <span>Localisation et Disponibilité</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Localisation du champ / entrepôt *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex : Obala, Bafoussam, Mbouda..."
                  list="cameroon-locations"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                    errors.location ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                  }`}
                />
                <datalist id="cameroon-locations">
                  {REGIONS_PRESETS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
                {errors.location && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Date ou délai de disponibilité *
                </label>
                <input
                  type="text"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  placeholder="Ex : Disponible immédiatement, Récolte sous 48h..."
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                    errors.harvestDate ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                  }`}
                />
                {errors.harvestDate && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.harvestDate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Urgent sale badge checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-950 block">
                    Vente urgente (produit très périssable à écouler immédiatement)
                  </span>
                  <span className="text-amber-800 text-[11px]">
                    Met en avant votre annonce auprès des acheteurs prêts à charger sous 24 heures.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* SECTION 4: CONTACT DU PRODUCTEUR */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">4</span>
              <span>Coordonnées du producteur</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Nom du producteur / coopérative *
                </label>
                <input
                  type="text"
                  value={producerName}
                  onChange={(e) => setProducerName(e.target.value)}
                  placeholder="Ex : Jean-Paul Nkoum"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                    errors.producerName ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                  }`}
                />
                {errors.producerName && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.producerName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Numéro de téléphone d'appel *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={producerPhone}
                    onChange={(e) => setProducerPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono ${
                      errors.producerPhone ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                    }`}
                  />
                </div>
                {errors.producerPhone && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.producerPhone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Numéro WhatsApp direct *
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={producerWhatsApp}
                    onChange={(e) => setProducerWhatsApp(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono ${
                      errors.producerWhatsApp ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                    }`}
                  />
                </div>
                {errors.producerWhatsApp && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.producerWhatsApp}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* SECTION 5: PHOTO DU PRODUIT */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">5</span>
              <span>Photo du produit *</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Preview card */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-300 shadow-inner">
                <img
                  src={imagePreview}
                  alt="Aperçu du produit"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-stone-900/80 text-white px-2 py-0.5 rounded">
                  Aperçu de la photo
                </span>
              </div>

              {/* Upload & Quick selection */}
              <div className="sm:col-span-2 space-y-4">
                {/* File input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Charger une photo depuis votre appareil
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl cursor-pointer bg-stone-50 hover:bg-emerald-50/30 transition-colors">
                    <Upload className="w-5 h-5 text-emerald-700 mb-1" />
                    <span className="text-xs font-semibold text-stone-800">
                      Cliquez pour choisir un fichier image
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Format PNG, JPG ou WebP (max 5 Mo)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {errors.image && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.image}</span>
                    </p>
                  )}
                </div>

                {/* Preset produce selector */}
                <div>
                  <p className="text-xs font-semibold text-stone-600 mb-2">
                    Ou choisissez une photo type correspondant à votre récolte :
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setImagePreview(preset.url);
                        }}
                        className={`text-left p-1.5 rounded-lg border text-[11px] transition-all flex flex-col items-center ${
                          imageUrl === preset.url
                            ? 'border-emerald-600 bg-emerald-100/70 font-bold text-emerald-950 shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-10 object-cover rounded mb-1"
                        />
                        <span className="truncate w-full text-center">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            En publiant cette offre, vous certifiez l'exactitude des quantités et des prix indiqués.
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Publier l'offre</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
