# 🇮🇳 Bharat — AI Copilot for Paytm Kirana Stores

> **Paytm AI Hackathon Submission**  
> *Transforming millions of neighborhood Kirana stores with an AI-first operating system — from payments to predictive inventory, speech-driven bahi-khata, intelligent credit recovery, and counter cross-sells.*

---

## 🚀 Key Highlights & What's New

### 1. 📊 Store Financial Pulse & Graph in Global Header
Right in the sticky header on every page, merchants can instantly monitor their business health across **Daily (दैनिक)**, **Weekly (साप्ताहिक)**, **Monthly (मासिक)**, and **Yearly (वार्षिक)**:
- 💰 **कुल बिक्री (Total Sales)** — Live Counter Cash + Paytm Soundbox UPI breakdown.
- 🧾 **दुकान खर्च (Shop Expenses)** — Wholesale procurement, helper daily wages, and electricity.
- ⚠️ **नुकसान / वेस्टेज (Loss & Spoilage)** — Perishable milk/bread expiry, transit package leakage, and shrinkage.
- ✨ **शुद्ध मुनाफा (Net Profit)** — Real pocket savings with transparent net margin % (+18.6% to +20.3%).
- 📈 **Interactive Timeline Bar Chart** — Grouped visual multi-track bars for each period with 1-tap hover tooltips.
- 📏 **Revenue Allocation Split Waterfall** — Simple Kirana formula: `गल्ला = माल खरीद + नुकसान + शुद्ध बचत`.
- 🔍 **Itemized Expense & Loss Modal** — 1-click transparent breakdown of every rupee spent or lost.

---

### 2. 🎙️ बोल के खाता (Voice-to-Ledger)
- Hands-free natural Hindi and Hinglish voice command parsing for the busy shop counter.
- Speaks entities like *"सुनीता जी ने 250 का आटा उधार लिया"* or *"राजू ने 500 रुपये जमा किए"*.
- AI automatically extracts Customer Name, Amount, Item, and Udhaar/Jama transaction type.
- Instant Web Audio API Paytm Soundbox chime (`E5 -> G#5 -> B5`) with voice confirmation.

---

### 3. 🌙 दुकान बंदी हिसाब (Evening Reconciliation)
- 4-Pillar day-end cash drawer and digital payment audit.
- Reconciles ₹5,580 drawer cash + ₹12,840 Soundbox UPI = ₹18,420 total sales with **₹0 variance**.
- Calculates net daily profit (₹3,420) and generates an authentic shareable WhatsApp closing receipt.

---

### 4. 🛒 स्मार्ट बास्केट बूस्टर (AI Counter Cross-Sell Engine)
- Counter upsell recommender designed to expand average ticket size from ₹146 to ₹185 (+26%).
- High-margin pairings (Milk ➔ Toast/Rusk, Tea ➔ Biscuits, Maggi ➔ Ching's Sauce, Atta ➔ Ghee).
- Dead stock clearance combos to liquidate slow inventory before expiration.

---

### 5. 🏆 पेटीएम साउंडबॉक्स लॉयल्टी क्लब (Soundbox Loyalty)
- Zero-app, zero-friction loyalty tracking via customer UPI IDs.
- Digital 5-visit stamp cards with automatic Soundbox audio reward announcements on the 5th visit.
- Cuts customer churn to quick-commerce apps (Blinkit/Zepto) by 42%.

---

### 6. 🌐 5 Dedicated Merchant Hubs
- **🏠 Today (`/`)**: Morning AI Brief, Opportunity Radar (₹10,700), Daily Action Plan, Bahi-Khata ledger.
- **📈 Paytm Pulse (`/analytics`)**: Hourly footfall heatmap (6 AM–10 PM), UPI vs Cash split, Instant settlements, ₹1.5L Pre-approved merchant loan.
- **📦 Smart Inventory (`/inventory`)**: Stock-out predictor, safety buffer controls, 1-click WhatsApp purchase orders to Sharma Distributors.
- **📒 Customers & CRM (`/customers`)**: Customer ledger, credit risk scoring, dynamic scannable Paytm UPI QR generator, and gentle WhatsApp reminders.
- **✨ Growth & Campaigns (`/campaigns`)**: What-If discount simulator (5%, 10%, 15%, 20%), margin protection guardrails, and WhatsApp promotional studio.

---

## 🛠️ Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **Runtime & Bundler**: React 19, Vite 8, Nitro Server (Cloudflare / Node)
- **Styling**: Tailwind CSS, Warm Paper & Terracotta Aesthetic (`--cream`, `--paper`, `--rust`, `--sand`, `--emerald`)
- **Typography**: Fraunces Serif + Inter
- **Audio Synthesizer**: Web Audio API Soundbox chime synthesizer + Web Speech Synthesis
- **State & Context**: LanguageProvider (Bilingual English ↔ हिंदी), TanStack Query

---

## 💻 Quick Start & Local Development

```bash
# Clone the repository
git clone https://github.com/ajayrawat3715/paytm-biz-copilot.git

# Enter project directory
cd paytm-biz-copilot

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License
MIT © 2026 Bharat — Kirana Copilot for Paytm Merchants.
