import React, { useState } from 'react';
import { PRODUCTS, getHistoricalData, Product } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export function ComparisonTool() {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['1', '2']);
  const { t, tProduct } = useLanguage();

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(prev => prev.filter(p => p !== id));
      }
    } else {
      if (selectedProductIds.length < 4) {
        setSelectedProductIds(prev => [...prev, id]);
      }
    }
  };

  // Prepare chart data
  const selectedProducts = PRODUCTS.filter(p => selectedProductIds.includes(p.id));
  
  const baseData = getHistoricalData(selectedProducts[0]?.currentPrice || 0, selectedProducts[0]?.id || '0');
  
  const chartData = baseData.map((d, index) => {
    const point: any = { date: d.date };
    selectedProducts.forEach(product => {
      const productHistory = getHistoricalData(product.currentPrice, product.id);
      point[tProduct(product.id)] = productHistory[index]?.price;
    });
    return point;
  });

  const colors = ['#16a34a', '#2563eb', '#dc2626', '#d97706'];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-earth-200">
        <h2 className="text-xl font-bold text-earth-900 mb-6">{t('priceComparison')}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selector */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-medium text-gray-700">{t('selectCrops')}</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {PRODUCTS.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                      isSelected 
                        ? "border-agri-500 bg-agri-50 text-agri-900" 
                        : "border-gray-200 hover:border-agri-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        isSelected ? "bg-agri-500 border-agri-500" : "border-gray-300 bg-white"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{tProduct(product.id)}</p>
                        <p className="text-xs text-gray-500">₹{product.currentPrice} {product.unit}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-2">
            <div className="bg-earth-50 rounded-xl p-4 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  {selectedProducts.map((product, index) => (
                    <Line
                      key={product.id}
                      type="monotone"
                      dataKey={tProduct(product.id)}
                      stroke={colors[index % colors.length]}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {selectedProducts.map((product, index) => (
                <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: colors[index % colors.length] }} />
                  <p className="text-sm font-medium text-gray-600 truncate">{tProduct(product.id)}</p>
                  <p className="text-lg font-bold text-earth-900">₹{product.currentPrice}</p>
                  <p className={cn(
                    "text-xs font-medium",
                    product.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {product.change >= 0 ? '+' : ''}{product.change}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
