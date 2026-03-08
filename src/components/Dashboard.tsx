import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { PRODUCTS, getHistoricalData, Product } from '../data/mockData';
import { cn } from '../lib/utils';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { t, tProduct } = useLanguage();

  const categories = ['All', 'Cereals', 'Vegetables', 'Fruits', 'Pulses'];

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('all');
    if (cat === 'Cereals') return t('cereals');
    if (cat === 'Vegetables') return t('vegetables');
    if (cat === 'Fruits') return t('fruits');
    if (cat === 'Pulses') return t('pulses');
    return cat;
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const productName = tProduct(product.id).toLowerCase();
    const matchesSearch = productName.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const topGainers = [...PRODUCTS].sort((a, b) => b.change - a.change).slice(0, 3);
  const topLosers = [...PRODUCTS].sort((a, b) => a.change - b.change).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-agri-800 to-agri-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
        <p className="text-agri-100 max-w-2xl">
          {t('welcomeDesc')}
        </p>
      </div>

      {/* Market Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gainers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-earth-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">{t('topGainers')}</h2>
          </div>
          <div className="space-y-4">
            {topGainers.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                <div>
                  <p className="font-medium text-earth-900">{tProduct(product.id)}</p>
                  <p className="text-sm text-gray-500">{getCategoryLabel(product.category)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-earth-900">₹{product.currentPrice}</p>
                  <p className="text-sm font-medium text-green-600">+{product.change}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-earth-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold">{t('topLosers')}</h2>
          </div>
          <div className="space-y-4">
            {topLosers.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                <div>
                  <p className="font-medium text-earth-900">{tProduct(product.id)}</p>
                  <p className="text-sm text-gray-500">{getCategoryLabel(product.category)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-earth-900">₹{product.currentPrice}</p>
                  <p className="text-sm font-medium text-red-600">{product.change}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Product List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-earth-900">{t('livePrices')}</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === cat
                      ? "bg-agri-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

