import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import SearchModal from './components/SearchModal';
import { CartProvider } from './context/CartContext';
import { MOCK_PRODUCTS } from './constants';
import { Product } from './types';

function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    // Delay clearing product to allow animation to finish (optional polish)
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <Hero />
      
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Latest Drops</h2>
          <div className="flex gap-2 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
            <button className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full shadow-md transform transition-transform hover:scale-105">All</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-full transition-colors">Apparel</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-full transition-colors">Tech</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p className="font-medium text-gray-900 mb-2">Luxe Shop AI</p>
          <p>© 2024 Next Gen E-Commerce Upgrade.</p>
        </div>
      </footer>

      <CartSidebar />
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseDetails} 
      />
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={MOCK_PRODUCTS}
        onOpenProductDetails={(p) => {
          setIsSearchOpen(false);
          setTimeout(() => handleOpenDetails(p), 100);
        }}
      />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  );
};

export default App;
