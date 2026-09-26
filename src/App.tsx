import React, { useState, useEffect } from 'react';
import { ProductOffer, UserProfile } from './types';
import { storageService } from './services/storageService';
import { DEMO_USERS } from './data/mockProducts';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { PublishOfferPage } from './pages/PublishOfferPage';
import { ProducerDashboardPage } from './pages/ProducerDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [products, setProducts] = useState<ProductOffer[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductOffer | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>('');
  const [targetSearch, setTargetSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from storageService
  useEffect(() => {
    const loadedProducts = storageService.getProducts();
    setProducts(loadedProducts);

    const user = storageService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigate = (page: string, categoryOrQuery?: string) => {
    if (page === 'products' && categoryOrQuery) {
      // Check if it's a known category or search query
      const knownCats = ['Fruits', 'Légumes', 'Céréales', 'Tubercules', 'Plantain', 'Produits vivriers', 'Autres'];
      if (knownCats.includes(categoryOrQuery)) {
        setTargetCategory(categoryOrQuery);
        setTargetSearch('');
      } else {
        setTargetSearch(categoryOrQuery);
        setTargetCategory('');
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: ProductOffer) => {
    // Increment view count
    storageService.incrementViews(product.id);
    const updated = storageService.getProductById(product.id);
    setSelectedProduct(updated || product);

    // Update in local state list
    setProducts(storageService.getProducts());
  };

  const handlePublish = (offerData: Omit<ProductOffer, 'id' | 'viewsCount' | 'createdAt'>) => {
    const created = storageService.addProduct(offerData);
    setProducts(storageService.getProducts());
    showToast(`Offre "${created.title}" publiée avec succès !`);
    return created;
  };

  const handleUpdateProduct = (id: string, updates: Partial<ProductOffer>) => {
    const updated = storageService.updateProduct(id, updates);
    if (updated) {
      setProducts(storageService.getProducts());
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(updated);
      }
      showToast('Annonce mise à jour avec succès.');
    }
  };

  const handleDeleteProduct = (id: string) => {
    const success = storageService.deleteProduct(id);
    if (success) {
      setProducts(storageService.getProducts());
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
      showToast('Annonce supprimée.');
    }
  };

  const handleSwitchUser = (role: 'producer' | 'buyer') => {
    const chosen = role === 'producer' ? DEMO_USERS.producer : DEMO_USERS.buyer;
    storageService.setCurrentUser(chosen);
    setCurrentUser(chosen);
    showToast(`Passé en profil : ${chosen.name} (${role === 'producer' ? 'Producteur' : 'Acheteur'})`);
  };

  const handleLogin = (user: UserProfile) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Connecté en tant que ${user.name}`);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Déconnecté avec succès.');
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous recharger les annonces et profils de démonstration du Cameroun ?')) {
      storageService.resetToDefault();
      setProducts(storageService.getProducts());
      setCurrentUser(storageService.getCurrentUser());
      showToast('Données de démonstration rechargées.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            products={products}
            initialCategory={targetCategory}
            initialSearch={targetSearch}
            onSelectProduct={handleSelectProduct}
            onNavigatePublish={() => handleNavigate('publish')}
          />
        )}

        {currentPage === 'publish' && (
          <PublishOfferPage
            currentUser={currentUser}
            onPublish={handlePublish}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <ProducerDashboardPage
            products={products}
            currentUser={currentUser}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onNavigatePublish={() => handleNavigate('publish')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
