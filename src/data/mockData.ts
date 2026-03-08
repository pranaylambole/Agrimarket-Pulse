export interface Product {
  id: string;
  name: string;
  category: 'Cereals' | 'Vegetables' | 'Fruits' | 'Pulses';
  currentPrice: number; // per quintal or kg
  unit: string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
}

export interface MarketPrice {
  marketName: string;
  price: number;
  distance: string;
}

export interface HistoricalData {
  date: string;
  price: number;
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Wheat (Sharbati)', category: 'Cereals', currentPrice: 2450, unit: '₹/Qtl', change: 2.5, trend: 'up' },
  { id: '2', name: 'Rice (Basmati)', category: 'Cereals', currentPrice: 4200, unit: '₹/Qtl', change: -1.2, trend: 'down' },
  { id: '3', name: 'Tomato (Hybrid)', category: 'Vegetables', currentPrice: 1800, unit: '₹/Qtl', change: 15.4, trend: 'up' },
  { id: '4', name: 'Onion (Red)', category: 'Vegetables', currentPrice: 1200, unit: '₹/Qtl', change: -5.0, trend: 'down' },
  { id: '5', name: 'Potato (Jyoti)', category: 'Vegetables', currentPrice: 950, unit: '₹/Qtl', change: 0.5, trend: 'stable' },
  { id: '6', name: 'Cotton (Long Staple)', category: 'Cereals', currentPrice: 6800, unit: '₹/Qtl', change: 1.8, trend: 'up' },
  { id: '7', name: 'Soybean', category: 'Pulses', currentPrice: 3900, unit: '₹/Qtl', change: -0.8, trend: 'down' },
  { id: '8', name: 'Banana (Robusta)', category: 'Fruits', currentPrice: 1400, unit: '₹/Qtl', change: 3.2, trend: 'up' },
];

export const MARKET_PRICES: Record<string, MarketPrice[]> = {
  '1': [
    { marketName: 'Local Mandi', price: 2400, distance: '5 km' },
    { marketName: 'City Central', price: 2550, distance: '25 km' },
    { marketName: 'Export Hub', price: 2600, distance: '120 km' },
  ],
  '3': [
    { marketName: 'Local Mandi', price: 1700, distance: '5 km' },
    { marketName: 'City Central', price: 1950, distance: '25 km' },
    { marketName: 'Metro Market', price: 2100, distance: '45 km' },
  ],
};

// Generate some fake historical data
// Use a simple pseudo-random number generator for stability
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const getHistoricalData = (basePrice: number, seed: string): HistoricalData[] => {
  const data: HistoricalData[] = [];
  let current = basePrice;
  const now = new Date();
  // Use a numeric seed from the string id
  let numericSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Random fluctuation between -2% and +2%
    const random = seededRandom(numericSeed + i);
    const change = (random - 0.5) * 0.04;
    current = current * (1 + change);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(current),
    });
  }
  return data;
};
