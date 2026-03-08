import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ComparisonTool } from './components/ComparisonTool';
import { Layout } from './components/Layout';
import { PRODUCTS } from './data/mockData';
import { Search, ArrowUpRight } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'compare' && <ComparisonTool />}
      {activeTab === 'products' && <AllProductsView />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

function AllProductsView() {
  const [search, setSearch] = useState('');
  const { t, tProduct } = useLanguage();

  const getCategoryLabel = (cat: string) => {
    if (cat === 'Cereals') return t('cereals');
    if (cat === 'Vegetables') return t('vegetables');
    if (cat === 'Fruits') return t('fruits');
    if (cat === 'Pulses') return t('pulses');
    return cat;
  };

  const filtered = PRODUCTS.filter(p => {
    const productName = tProduct(p.id).toLowerCase();
    const categoryName = getCategoryLabel(p.category).toLowerCase();
    return productName.includes(search.toLowerCase()) ||
      categoryName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-earth-200 shadow-sm">
        <h2 className="text-xl font-bold text-earth-900">{t('allCommodities')}</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchAll')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-earth-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('commodity')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('category')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('price')} (₹/Qtl)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('change')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-earth-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-earth-900">{tProduct(product.id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-earth-900">
                    ₹{product.currentPrice}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center text-sm font-medium ${product.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {product.change >= 0 ? '+' : ''}{product.change}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-agri-600 hover:text-agri-700 font-medium text-sm inline-flex items-center gap-1">
                      {t('details')} <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
