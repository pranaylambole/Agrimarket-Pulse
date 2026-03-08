import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { getHistoricalData, Product } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const historicalData = getHistoricalData(product.currentPrice, product.id);
  const isPositive = product.change >= 0;
  const { t, tProduct } = useLanguage();

  const getCategoryLabel = (cat: string) => {
    if (cat === 'Cereals') return t('cereals');
    if (cat === 'Vegetables') return t('vegetables');
    if (cat === 'Fruits') return t('fruits');
    if (cat === 'Pulses') return t('pulses');
    return cat;
  };

  return (
    <div className="bg-white rounded-xl border border-earth-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-1 rounded-md bg-earth-100 text-xs font-medium text-gray-600 mb-2">
              {getCategoryLabel(product.category)}
            </span>
            <h3 className="text-lg font-bold text-earth-900">{tProduct(product.id)}</h3>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg",
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(product.change)}%
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-earth-900">₹{product.currentPrice}</span>
          <span className="text-gray-500 text-sm">/ {product.unit.split('/')[1]}</span>
        </div>

        {/* Mini Chart */}
        <div className="h-16 -mx-5 -mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id={`gradient-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#22c55e" : "#ef4444"} 
                strokeWidth={2}
                fill={`url(#gradient-${product.id})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
