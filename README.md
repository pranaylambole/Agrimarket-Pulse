# 🌾 Agrimarket Pulse

A comprehensive **agricultural market price tracking and comparison tool** built for Indian farmers, providing real-time commodity prices, trend analysis, and market insights — available in multiple regional languages.

---

## ✨ Features

- 📊 **Live Price Dashboard** — Track current prices for cereals, vegetables, fruits, and pulses
- 🔄 **Commodity Comparison Tool** — Compare prices across multiple commodities side by side
- 📈 **Price Trend Charts** — Visualize historical price movements with interactive recharts
- 🌐 **Multilingual Support** — Switch between English, Hindi, Marathi, Tamil, Telugu, and more
- 🔍 **Smart Search & Filter** — Search all commodities by name or category
- 🔐 **Authentication** — Sign up / Sign in to personalize your experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | Motion (Framer Motion) |
| Build Tool | Vite |
| Backend (optional) | Express + SQLite (better-sqlite3) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pranaylambole/Agrimarket-Pulse.git
cd Agrimarket-Pulse

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
agrimarket-pulse/
├── src/
│   ├── components/       # UI components (Dashboard, Layout, ComparisonTool, etc.)
│   ├── contexts/         # React context (LanguageContext)
│   ├── data/             # Mock data & translations
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🌍 Supported Languages

- English
- हिन्दी (Hindi)
- मराठी (Marathi)
- தமிழ் (Tamil)
- తెలుగు (Telugu)
- ಕನ್ನಡ (Kannada)
- বাংলা (Bengali)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
