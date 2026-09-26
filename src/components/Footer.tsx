import React from 'react';
import { Sprout, Phone, MessageSquare, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-serif">
                AgroLink Cameroun
              </span>
            </div>
            <p className="text-emerald-400 text-sm font-semibold italic">
              « Du champ au marché, sans perte. »
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              La marketplace agricole qui relie directement les producteurs de la Lékié, de l'Ouest,
              du Mbam et du Nord-Ouest aux acheteurs de Yaoundé (marchés Mokolo, Mfoundi, restaurants, hôtels et ménages).
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zéro intermédiaire abusif · Prix direct producteur</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Accueil & Présentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Catalogue des produits disponibles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('publish')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Publier une offre de récolte
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Tableau de bord producteur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('auth')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Espace Inscription / Connexion
                </button>
              </li>
            </ul>
          </div>

          {/* Supply corridors */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Bassins d'approvisionnement Yaoundé
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong className="text-stone-300">Lékié :</strong> Obala, Sa'a, Batchenga (Manioc, Piment, Tomates)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong className="text-stone-300">Ouest :</strong> Bafoussam, Mbouda, Foumban (Plantain, Maïs, Tomates)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong className="text-stone-300">Nord-Ouest :</strong> Santa, Bamenda (Pommes de terre)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong className="text-stone-300">Haute-Sanaga :</strong> Ntui, Nanga-Eboko (Avocats, Bananes)</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Centre d'Assistance Cameroun
            </h4>
            <p className="text-xs text-stone-400">
              Une question ou besoin d'aide pour publier une récolte par téléphone ?
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="tel:+237699451230"
                className="flex items-center gap-2 text-xs bg-stone-800 hover:bg-stone-750 border border-stone-700 px-3 py-2 rounded-lg text-emerald-300 font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+237 699 45 12 30 (Appel direct)</span>
              </a>
              <a
                href="https://wa.me/237699451230?text=Bonjour%20AgroLink%20Cameroun,%20je%20souhaite%20des%20renseignements"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/80 px-3 py-2 rounded-lg text-emerald-300 font-medium transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Support AgroLink</span>
              </a>
            </div>
            <p className="text-[11px] text-stone-400 pt-1">
              Horaires : 06h00 – 20h00 (7j/7 pour la gestion des récoltes)
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} AgroLink Cameroun. Tous droits réservés. Dédié aux producteurs et acheteurs locaux.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Conçu avec</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>pour le développement de l'agriculture camerounaise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
