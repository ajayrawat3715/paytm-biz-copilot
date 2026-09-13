export interface ShopInfo {
  name: string;
  area: string;
  owner: string;
  initial: string;
}

export const shopInfo: ShopInfo = {
  name: "Annapurna Kirana",
  area: "Goripur, Patna",
  owner: "Ramesh",
  initial: "A",
};

export interface PriorityItem {
  id: string;
  title: string;
  metric: string;
  impact: string;
  actionText: string;
  targetSection: "campaign" | "inventory" | "udhaar";
  tone: "gain" | "warning" | "neutral";
}

export const morningForecast = {
  greeting: "Good morning, Ramesh.\nToday looks a little quiet.",
  forecastHeadline: "Today's business forecast",
  forecastNote: "Sales may be 16% lower than your usual Saturday.",
  usualSales: 21900,
  currentSales: 18420,
  percentLower: 16,
  priorities: [
    {
      id: "priority-inactive",
      title: "Bring back inactive customers",
      metric: "240 customers haven't visited recently",
      impact: "Estimated additional sales: ₹6,100",
      actionText: "Review & send",
      targetSection: "campaign",
      tone: "gain",
    },
    {
      id: "priority-stock",
      title: "Restock Parle biscuits",
      metric: "Current stock: 0",
      impact: "Estimated lost evening sales if not restocked: ₹1,800",
      actionText: "Review order",
      targetSection: "inventory",
      tone: "warning",
    },
    {
      id: "priority-udhaar",
      title: "Collect overdue udhaar",
      metric: "₹2,800 is overdue",
      impact: "5 customers need a reminder",
      actionText: "Review reminders",
      targetSection: "udhaar",
      tone: "neutral",
    },
  ] as PriorityItem[],
};

export interface WorthDoingItem {
  id: string;
  title: string;
  problem: string;
  whyDetected: string[];
  recommendation: string;
  expectedImpact: string;
  actionLabel: string;
  tag: string;
  tagTone: "gain" | "neutral" | "warning";
  actionType: "campaign" | "inventory" | "udhaar";
  doneMessage: string;
}

export const worthDoingItems: WorthDoingItem[] = [
  {
    id: "campaign-card",
    title: "Tuesday sales are unusually low",
    problem: "Sales are 16% below your normal Tuesday average.",
    whyDetected: [
      "240 customers have not visited in 15+ days",
      "Tuesday evening sales are down 21%",
      "Average basket size is lower than usual",
    ],
    recommendation: "Send a 10% Tuesday offer to inactive customers.",
    expectedImpact: "Potential additional sales: ₹6,100",
    actionLabel: "Review & send",
    tag: "+₹6,100",
    tagTone: "gain",
    actionType: "campaign",
    doneMessage: "10% offer scheduled for 240 inactive customers (4 PM – 8 PM).",
  },
  {
    id: "inventory-card",
    title: "Parle biscuits at zero stock",
    problem: "Current stock is 0 units before the 5 PM evening tea rush.",
    whyDetected: [
      "Average daily sales: 18 units",
      "Expected evening demand: 12 units",
      "Last packet sold yesterday evening",
    ],
    recommendation: "Reorder 24 units from Sharma Distributors before evening rush.",
    expectedImpact: "Avoid lost sales: ₹1,800",
    actionLabel: "Review order",
    tag: "Save ₹1,800",
    tagTone: "neutral",
    actionType: "inventory",
    doneMessage: "Purchase order for 24 units dispatched to Sharma Distributors.",
  },
  {
    id: "udhaar-card",
    title: "Overdue udhaar ready for friendly collection",
    problem: "₹2,800 is overdue across 5 regular customers.",
    whyDetected: [
      "Due dates exceeded by 5 to 14 days",
      "Customers have strong past repayment scores",
      "Payment link via Paytm UPI increases same-day settlement by 43%",
    ],
    recommendation: "Send a friendly, respectful WhatsApp reminder with Paytm UPI link.",
    expectedImpact: "Recover pending cash: ₹2,800",
    actionLabel: "Review reminders",
    tag: "Recover ₹2,800",
    tagTone: "gain",
    actionType: "udhaar",
    doneMessage: "5 friendly reminders sent via WhatsApp with UPI payment link.",
  },
];

export const campaignSimulationData = {
  targetCount: 240,
  targetAudience: "240 inactive customers (no visit in 15+ days)",
  defaultOffer: "10% off",
  duration: "Today, 4 PM – 8 PM",
  tiers: {
    tenPercent: {
      discount: 10,
      returningCustomers: 38,
      additionalSales: 6100,
      estimatedProfit: 2100,
      verdict: "I'd choose 10%. The 15% discount may increase sales but reduces estimated profit.",
    },
    fifteenPercent: {
      discount: 15,
      returningCustomers: 51,
      additionalSales: 7200,
      estimatedProfit: 1750,
      verdict: "High volume but thinner margin: ₹350 lower profit despite 13 more customers.",
    },
  },
  calculateCustom: (discountPercent: number) => {
    const d = Math.max(5, Math.min(30, discountPercent));
    const factor = d / 10;
    const returningCustomers = Math.round(38 * Math.pow(factor, 0.65));
    const additionalSales = Math.round(6100 * Math.pow(factor, 0.45));
    const marginRate = Math.max(0.08, 0.42 - d / 100);
    const estimatedProfit = Math.round(additionalSales * marginRate);
    const recommendation =
      d <= 10
        ? "Optimal profit zone. Generates solid footfall while safeguarding your margins."
        : d <= 15
        ? "Higher volume, but margin compression begins to reduce net take-home profit."
        : "Caution: Heavy discounts stimulate footfall but drastically erode your net profit.";
    return {
      discount: d,
      returningCustomers,
      additionalSales,
      estimatedProfit,
      verdict: recommendation,
    };
  },
};

export const paytmInsightsData = {
  todayPayments: 18420,
  upiTransactions: 126,
  averageTransaction: 146,
  repeatCustomers: 68,
  upiRevenue: 12840,
  cashRevenue: 5580,
  weeklySales: [
    { day: "Mon", date: "Sep 7", upi: 10200, cash: 5400, total: 15600 },
    { day: "Tue", date: "Sep 8", upi: 8900, cash: 4800, total: 13700 },
    { day: "Wed", date: "Sep 9", upi: 11400, cash: 6100, total: 17500 },
    { day: "Thu", date: "Sep 10", upi: 12100, cash: 6300, total: 18400 },
    { day: "Fri", date: "Sep 11", upi: 13500, cash: 6900, total: 20400 },
    { day: "Sat", date: "Today", upi: 12840, cash: 5580, total: 18420 },
    { day: "Sun", date: "Forecast", upi: 14800, cash: 7100, total: 21900 },
  ],
  aiInsights: [
    {
      id: "upi-spend",
      title: "Higher Basket Size on UPI",
      text: "Your UPI customers spend around 18% more per visit than cash customers.",
      metric: "₹172 avg UPI vs ₹146 overall",
      action: "Promote Paytm QR at billing counter",
    },
    {
      id: "lapsed-regulars",
      title: "High-Value Regulars Missing",
      text: "7 regular customers who normally spend ₹300+ have not visited in 10 days.",
      metric: "₹2,100+ weekly potential at risk",
      action: "Trigger VIP WhatsApp check-in",
    },
    {
      id: "evening-peak",
      title: "Saturday Evening Peak",
      text: "Saturday evening contributes 34% of your weekly revenue.",
      metric: "Peak rush: 5:30 PM – 9:00 PM",
      action: "Ensure counter staff and stock ready",
    },
  ],
};

export interface OverdueCustomer {
  id: string;
  name: string;
  phone: string;
  amount: number;
  daysLate: number;
  items: string;
  hindiMessage: string;
  englishMessage: string;
}

export const udhaarAIData = {
  totalPending: 12840,
  dueToday: 3200,
  overdue: 2800,
  buckets: [
    {
      label: "Likely to pay",
      amount: 4200,
      count: 3,
      tone: "emerald" as const,
      description: "Consistent payers, active grace period",
    },
    {
      label: "Overdue",
      amount: 5840,
      count: 4,
      tone: "amber" as const,
      description: "Past scheduled date by 1-4 days",
    },
    {
      label: "High attention",
      amount: 2800,
      count: 5,
      tone: "rust" as const,
      description: "Overdue 5-14 days — needs gentle follow-up",
    },
  ],
  recommendation: "₹2,800 is overdue across 5 customers. I recommend sending a friendly reminder today.",
  overdueCustomers: [
    {
      id: "c1",
      name: "Rajesh Kumar",
      phone: "98350 41122",
      amount: 800,
      daysLate: 8,
      items: "Atta 10kg, Mustard Oil",
      hindiMessage: "Namaste Rajesh ji, aapka ₹800 ka udhaar pending hai. Jab convenient ho, please payment kar dijiye. Paytm UPI link: paytm.me/kirana-ramesh",
      englishMessage: "Namaste Rajesh ji, your pending balance of ₹800 is due. Please pay when convenient via Paytm UPI: paytm.me/kirana-ramesh",
    },
    {
      id: "c2",
      name: "Sunita Devi",
      phone: "98721 55431",
      amount: 650,
      daysLate: 12,
      items: "Monthly spices, Turmeric, Dal",
      hindiMessage: "Namaste Sunita ji, aapka ₹650 ka udhaar pending hai. Jab convenient ho, please payment kar dijiye. Paytm UPI link: paytm.me/kirana-ramesh",
      englishMessage: "Namaste Sunita ji, your pending balance of ₹650 is due. Please pay when convenient via Paytm UPI: paytm.me/kirana-ramesh",
    },
    {
      id: "c3",
      name: "Amit Verma",
      phone: "99341 88204",
      amount: 500,
      daysLate: 5,
      items: "Sugar 5kg, Tata Tea Premium",
      hindiMessage: "Namaste Amit ji, aapka ₹500 ka udhaar pending hai. Jab convenient ho, please payment kar dijiye. Paytm UPI link: paytm.me/kirana-ramesh",
      englishMessage: "Namaste Amit ji, your pending balance of ₹500 is due. Please pay when convenient via Paytm UPI: paytm.me/kirana-ramesh",
    },
    {
      id: "c4",
      name: "Manoj Singh",
      phone: "97712 33417",
      amount: 450,
      daysLate: 7,
      items: "Amul Milk 2L, Butter, Bread",
      hindiMessage: "Namaste Manoj ji, aapka ₹450 ka udhaar pending hai. Jab convenient ho, please payment kar dijiye. Paytm UPI link: paytm.me/kirana-ramesh",
      englishMessage: "Namaste Manoj ji, your pending balance of ₹450 is due. Please pay when convenient via Paytm UPI: paytm.me/kirana-ramesh",
    },
    {
      id: "c5",
      name: "Vikram Patel",
      phone: "96190 77510",
      amount: 400,
      daysLate: 14,
      items: "Detergent powder, Lifebuoy soap",
      hindiMessage: "Namaste Vikram ji, aapka ₹400 ka udhaar pending hai. Jab convenient ho, please payment kar dijiye. Paytm UPI link: paytm.me/kirana-ramesh",
      englishMessage: "Namaste Vikram ji, your pending balance of ₹400 is due. Please pay when convenient via Paytm UPI: paytm.me/kirana-ramesh",
    },
  ] as OverdueCustomer[],
};

export const inventoryIntelligenceData = {
  parleBiscuits: {
    productName: "Parle biscuits (Gold 100g)",
    currentStock: 0,
    averageDailySales: 18,
    expectedEveningDemand: 12,
    recommendedReorder: 24,
    potentialLostSales: 1800,
    supplierName: "Sharma Distributors",
    supplierPhone: "98350 99881",
    wholesalePricePerUnit: 20,
    retailPricePerUnit: 25,
    totalWholesaleCost: 480,
    expectedSalesRevenue: 600,
    stockStatus: "Zero stock",
    urgency: "Immediate before 5 PM",
  },
  otherAlerts: [
    {
      productName: "Thums Up / Coca-Cola (250ml)",
      currentStock: 4,
      recommendedReorder: 30,
      potentialLostSales: 1200,
      supplierName: "Patna Beverages",
      supplierPhone: "98765 44321",
    },
    {
      productName: "Modern Sliced Bread (400g)",
      currentStock: 2,
      recommendedReorder: 20,
      potentialLostSales: 900,
      supplierName: "Daily Bake Co.",
      supplierPhone: "98123 77654",
    },
  ],
};

export const businessHealthData = {
  sales: { change: "+8%", note: "vs last Saturday", isPositive: true },
  customers: { change: "+12%", note: "repeat footfall", isPositive: true },
  inventory: { note: "3 items need attention", isAlert: true },
  udhaar: { amount: 12840, note: "pending collection", isAlert: false },
};

export const aiExplanationData = {
  title: "Bharat based this recommendation on:",
  confidence: {
    percentage: 87,
    level: "High confidence",
    label: "AI confidence: 87% (High confidence)",
  },
  signals: [
    {
      icon: "Calendar",
      title: "Last 30 days of sales",
      detail: "Normalized hourly transaction velocity and Saturday baseline patterns.",
    },
    {
      icon: "Users",
      title: "Customer visit frequency",
      detail: "Identified 240 registered customers with 0 visits in the last 15+ days.",
    },
    {
      icon: "QrCode",
      title: "UPI / payment patterns",
      detail: "68% UPI adoption rate with ₹172 avg ticket, showing basket expansion potential.",
    },
    {
      icon: "IndianRupee",
      title: "Average basket size",
      detail: "Evening average basket down 8% compared to historical monthly trend.",
    },
    {
      icon: "Package",
      title: "Inventory movement",
      detail: "Zero stock alert on Parle biscuits with impending 12-unit evening rush demand.",
    },
    {
      icon: "TrendingUp",
      title: "Day-of-week trends",
      detail: "Detected 16% volume shortfall between 11 AM and 2 PM vs typical Saturday pattern.",
    },
  ],
};

export interface OpportunityRadarItem {
  id: string;
  title: string;
  desc: string;
  opportunityAmount: number;
  reason: string;
  recommendedAction: string;
  buttonText: string;
  type: "campaign" | "inventory" | "udhaar";
  badge: string;
}

export const opportunityRadarData = {
  headline: "💰 Bharat Opportunity Radar",
  subtitle: "Bharat continuously scans your business for opportunities.",
  totalOpportunity: 10700,
  disclaimer:
    "Estimated potential based on current business patterns. Actual results may vary.",
  items: [
    {
      id: "radar-inactive",
      title: "RECOVER INACTIVE CUSTOMERS",
      desc: "240 customers haven't visited recently.",
      opportunityAmount: 6100,
      reason: "Tuesday customer activity is 21% below normal.",
      recommendedAction: "Launch a 10% targeted offer.",
      buttonText: "Review opportunity",
      type: "campaign",
      badge: "Revenue Growth",
    },
    {
      id: "radar-stock",
      title: "PREVENT STOCK LOSS",
      desc: "Parle biscuits are currently out of stock.",
      opportunityAmount: 1800,
      reason: "Current stock is 0 and average daily sales are 18 units.",
      recommendedAction: "Recommended reorder: 24 units.",
      buttonText: "Review order",
      type: "inventory",
      badge: "Stock Protection",
    },
    {
      id: "radar-udhaar",
      title: "RECOVER UDHAAR",
      desc: "₹2,800 is overdue across 5 customers.",
      opportunityAmount: 2800,
      reason: "5 regular customers past promised due date by 5-14 days.",
      recommendedAction: "Send friendly payment reminders.",
      buttonText: "Review reminders",
      type: "udhaar",
      badge: "Cash Recovery",
    },
  ] as OpportunityRadarItem[],
};

export interface ActionPlanItem {
  id: string;
  priorityBadge: string;
  priorityColor: "red" | "orange" | "emerald";
  title: string;
  why: string;
  impact: string;
  buttonText: string;
  type: "inventory" | "campaign" | "udhaar";
}

export const actionPlanData = {
  headline: "Today's Action Plan",
  subtitle: "3 things Bharat recommends you do today.",
  buttonReviewAll: "Review all actions",
  items: [
    {
      id: "plan-inventory",
      priorityBadge: "🔴 HIGH PRIORITY",
      priorityColor: "red",
      title: "Restock Parle biscuits",
      why: "Current stock is 0 and average daily sales are 18 units.",
      impact: "Potentially prevent ₹1,800 in lost sales.",
      buttonText: "Review",
      type: "inventory",
    },
    {
      id: "plan-campaign",
      priorityBadge: "🟠 GROWTH OPPORTUNITY",
      priorityColor: "orange",
      title: "Bring back inactive customers",
      why: "240 customers haven't visited recently.",
      impact: "Estimated opportunity: ₹6,100.",
      buttonText: "Review",
      type: "campaign",
    },
    {
      id: "plan-udhaar",
      priorityBadge: "🟢 CASH RECOVERY",
      priorityColor: "emerald",
      title: "Follow up on overdue udhaar",
      why: "₹2,800 overdue. 5 customers need attention.",
      impact: "Recover pending cash: ₹2,800.",
      buttonText: "Review",
      type: "udhaar",
    },
  ] as ActionPlanItem[],
};

export const bharatAutopilotData = {
  title: "BHARAT AUTOPILOT",
  description: "Let Bharat prepare today's business actions for your approval.",
  notice:
    "Demo simulation: Bharat never performs real financial transactions or sends real messages without manual confirmation.",
  headline: "I found 3 actions that could improve today's business.",
  totalOpportunity: 10700,
  actions: [
    {
      id: "auto-1",
      number: "ACTION 1",
      title: "Restock Parle biscuits",
      detail: "24 units reorder draft for Sharma Distributors",
      status: "✓ Ready",
      impact: "+₹1,800 saved sales",
    },
    {
      id: "auto-2",
      number: "ACTION 2",
      title: "Target inactive customers",
      detail: "240 customers · 10% offer · 4 PM – 8 PM",
      status: "✓ Ready",
      impact: "+₹6,100 sales (₹2,100 profit)",
    },
    {
      id: "auto-3",
      number: "ACTION 3",
      title: "Udhaar reminders",
      detail: "5 customers · ₹2,800 overdue · Polite Hindi WhatsApp draft",
      status: "✓ Ready",
      impact: "₹2,800 cash recovery",
    },
  ],
  simulationSteps: [
    "Customer segment prepared",
    "Offer generated",
    "Inventory reorder prepared",
    "Udhaar reminders prepared",
    "Expected impact calculated",
  ],
};

export const businessMemoryData = {
  title: "Bharat Business Memory",
  subtitle: "Bharat learns your business preferences",
  preferences: [
    {
      label: "Safety stock preference",
      value: "3 days",
      detail: "Maintains 3 days buffer for biscuits and high-velocity staples.",
    },
    {
      label: "Preferred supplier",
      value: "Sharma Distributors",
      detail: "Fastest Patna delivery and wholesale discount partner.",
    },
    {
      label: "Preferred promotion",
      value: "10% maximum discount",
      detail: "Protects gross margin while maintaining customer footfall.",
    },
  ],
  sampleReasoning:
    "You prefer maintaining 3 days of safety stock, so I increased the recommended reorder quantity to 24 units.",
};

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  dailyVelocity: number;
  daysRemaining: number;
  reorderLevel: number;
  supplier: string;
  supplierPhone: string;
  price: number;
  costPrice: number;
  status: "out_of_stock" | "low_stock" | "healthy";
}

export const inventoryCatalog: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Parle-G Glucose Biscuits 250g",
    category: "Biscuits & Snacks",
    stock: 0,
    unit: "packs",
    dailyVelocity: 18,
    daysRemaining: 0,
    reorderLevel: 24,
    supplier: "Sharma Distributors",
    supplierPhone: "+91 98350 12345",
    price: 30,
    costPrice: 24,
    status: "out_of_stock",
  },
  {
    id: "inv-2",
    name: "Fortune Kachi Ghani Mustard Oil 1L",
    category: "Edible Oils",
    stock: 4,
    unit: "pouches",
    dailyVelocity: 6,
    daysRemaining: 0.7,
    reorderLevel: 18,
    supplier: "Gupta FMCG Patna",
    supplierPhone: "+91 98350 67890",
    price: 155,
    costPrice: 138,
    status: "low_stock",
  },
  {
    id: "inv-3",
    name: "Maggi 2-Minute Masala Noodles 70g",
    category: "Instant Food",
    stock: 12,
    unit: "packs",
    dailyVelocity: 22,
    daysRemaining: 0.5,
    reorderLevel: 48,
    supplier: "Sharma Distributors",
    supplierPhone: "+91 98350 12345",
    price: 14,
    costPrice: 11.5,
    status: "low_stock",
  },
  {
    id: "inv-4",
    name: "Britannia Good Day Butter 100g",
    category: "Biscuits & Snacks",
    stock: 6,
    unit: "packs",
    dailyVelocity: 14,
    daysRemaining: 0.4,
    reorderLevel: 24,
    supplier: "Sharma Distributors",
    supplierPhone: "+91 98350 12345",
    price: 25,
    costPrice: 20,
    status: "low_stock",
  },
  {
    id: "inv-5",
    name: "Tata Salt Vacuum Evaporated 1kg",
    category: "Staples & Spices",
    stock: 28,
    unit: "packs",
    dailyVelocity: 12,
    daysRemaining: 2.3,
    reorderLevel: 30,
    supplier: "Gupta FMCG Patna",
    supplierPhone: "+91 98350 67890",
    price: 28,
    costPrice: 23,
    status: "healthy",
  },
  {
    id: "inv-6",
    name: "Aashirvaad Shudh Chakki Atta 5kg",
    category: "Flours & Grains",
    stock: 15,
    unit: "bags",
    dailyVelocity: 5,
    daysRemaining: 3.0,
    reorderLevel: 20,
    supplier: "Gupta FMCG Patna",
    supplierPhone: "+91 98350 67890",
    price: 260,
    costPrice: 230,
    status: "healthy",
  },
  {
    id: "inv-7",
    name: "Surf Excel Easy Wash Detergent 500g",
    category: "Cleaning & Hygiene",
    stock: 9,
    unit: "packs",
    dailyVelocity: 4,
    daysRemaining: 2.2,
    reorderLevel: 15,
    supplier: "Sharma Distributors",
    supplierPhone: "+91 98350 12345",
    price: 82,
    costPrice: 70,
    status: "healthy",
  },
  {
    id: "inv-8",
    name: "Taj Mahal Premium Tea 250g",
    category: "Beverages",
    stock: 11,
    unit: "boxes",
    dailyVelocity: 4,
    daysRemaining: 2.8,
    reorderLevel: 12,
    supplier: "Sharma Distributors",
    supplierPhone: "+91 98350 12345",
    price: 190,
    costPrice: 165,
    status: "healthy",
  },
];

export const hourlyTrafficData = [
  { time: "06:00", sales: 420, txns: 5, label: "Morning Opening" },
  { time: "07:00", sales: 1180, txns: 12, label: "Milk & Bread" },
  { time: "08:00", sales: 2450, txns: 24, label: "Breakfast Rush" },
  { time: "09:00", sales: 2100, txns: 19, label: "Morning Errands" },
  { time: "10:00", sales: 1350, txns: 11, label: "Midday Lull" },
  { time: "11:00", sales: 980, txns: 8, label: "Afternoon Slow" },
  { time: "12:00", sales: 860, txns: 7, label: "Lunch Hour" },
  { time: "13:00", sales: 640, txns: 5, label: "Afternoon Slump" },
  { time: "14:00", sales: 520, txns: 4, label: "Quiet Counter" },
  { time: "15:00", sales: 710, txns: 6, label: "School Dispersal" },
  { time: "16:00", sales: 1240, txns: 11, label: "Tea Time Begins" },
  { time: "17:00", sales: 2150, txns: 18, label: "Evening Rush" },
  { time: "18:00", sales: 2890, txns: 26, label: "Peak Grocery Rush" },
  { time: "19:00", sales: 3240, txns: 28, label: "Dinner Essentials" },
  { time: "20:00", sales: 2180, txns: 17, label: "Late Commuters" },
  { time: "21:00", sales: 940, txns: 8, label: "Shop Closing" },
];

export const settlementLog = [
  {
    id: "set-1",
    time: "Today, 06:00 AM",
    amount: "₹6,420",
    bank: "HDFC Bank (A/C **4102)",
    status: "Settled instantly",
    source: "Paytm Soundbox 4.0 Overnight Batches",
  },
  {
    id: "set-2",
    time: "Today, 12:00 PM",
    amount: "₹4,120",
    bank: "HDFC Bank (A/C **4102)",
    status: "Settled instantly",
    source: "Paytm Soundbox 4.0 Midday Batches",
  },
  {
    id: "set-3",
    time: "Yesterday, 09:30 PM",
    amount: "₹8,900",
    bank: "HDFC Bank (A/C **4102)",
    status: "Settled instantly",
    source: "Paytm UPI QR EOD Auto-Sweep",
  },
];

export const customerDirectory = [
  {
    id: "cust-1",
    name: "Sunita Sharma",
    phone: "+91 98765 43210",
    status: "overdue",
    riskLevel: "high",
    balance: 800,
    daysOverdue: 14,
    lastPurchase: "14 days ago",
    items: "Aashirvaad Atta 5kg, Fortune Mustard Oil",
    totalVisits: 18,
    paymentPreference: "Paytm UPI",
  },
  {
    id: "cust-2",
    name: "Vikram Singh",
    phone: "+91 98123 45678",
    status: "overdue",
    riskLevel: "high",
    balance: 650,
    daysOverdue: 12,
    lastPurchase: "12 days ago",
    items: "Tata Salt, MDH Deggi Mirch, Basmati Rice",
    totalVisits: 22,
    paymentPreference: "Paytm UPI",
  },
  {
    id: "cust-3",
    name: "Rajesh Kumar",
    phone: "+91 98989 12345",
    status: "overdue",
    riskLevel: "high",
    balance: 500,
    daysOverdue: 9,
    lastPurchase: "9 days ago",
    items: "Amul Butter, Taj Mahal Tea, Sugar 2kg",
    totalVisits: 14,
    paymentPreference: "Paytm UPI",
  },
  {
    id: "cust-4",
    name: "Meena Devi",
    phone: "+91 98711 22334",
    status: "overdue",
    riskLevel: "moderate",
    balance: 450,
    daysOverdue: 8,
    lastPurchase: "8 days ago",
    items: "Surf Excel 500g, Maggi Noodles, Biscuits",
    totalVisits: 9,
    paymentPreference: "Cash / UPI",
  },
  {
    id: "cust-5",
    name: "Amit Verma",
    phone: "+91 98222 33445",
    status: "overdue",
    riskLevel: "moderate",
    balance: 400,
    daysOverdue: 7,
    lastPurchase: "7 days ago",
    items: "Mosquito coils, Dettol soap, Batteries",
    totalVisits: 11,
    paymentPreference: "Paytm UPI",
  },
  {
    id: "cust-6",
    name: "Anita Gupta",
    phone: "+91 98333 44556",
    status: "regular",
    riskLevel: "low",
    balance: 0,
    daysOverdue: 0,
    lastPurchase: "Today (Morning)",
    items: "Amul Milk, Bread, Eggs 6pcs",
    totalVisits: 46,
    paymentPreference: "Paytm UPI Soundbox",
  },
  {
    id: "cust-7",
    name: "Manoj Tiwari",
    phone: "+91 98444 55667",
    status: "regular",
    riskLevel: "low",
    balance: 150,
    daysOverdue: 0,
    lastPurchase: "Yesterday",
    items: "Toothpaste, Coconut Oil",
    totalVisits: 31,
    paymentPreference: "Paytm UPI",
  },
  {
    id: "cust-8",
    name: "Inactive Cohort (240 Customers)",
    phone: "Multiple Phone Numbers",
    status: "inactive",
    riskLevel: "opportunity",
    balance: 0,
    daysOverdue: 0,
    lastPurchase: "15 to 45 days ago",
    items: "Lapsed evening grocery buyers",
    totalVisits: 240,
    paymentPreference: "Paytm UPI",
  },
];

export const campaignRecipes = [
  {
    id: "rec-1",
    title: "Quiet Tuesday 10% Reactivation",
    targetAudience: "240 inactive customers (15+ days)",
    timing: "4:00 PM – 8:00 PM Today",
    discount: "10% OFF on all staples over ₹300",
    expectedFootfall: "38 returning customers",
    expectedRevenue: "₹6,100",
    expectedProfit: "₹2,100",
    profitTag: "⭐ Recommended (Best margin)",
    whatsappTemplate:
      "नमस्ते! अन्नपूर्णा किराना से आपके लिए विशेष उपहार: आज शाम 4 से 8 बजे तक ₹300 की खरीदारी पर 10% छूट। पेटीएम/यूपीआई से तुरंत भुगतान करें!",
  },
  {
    id: "rec-2",
    title: "Monsoon Chai & Snack Bundle",
    targetAudience: "45 regular evening buyers",
    timing: "5:00 PM – 9:00 PM Daily",
    discount: "₹15 OFF on Taj Mahal Tea + 2 Parle-G packs",
    expectedFootfall: "24 basket upgrades",
    expectedRevenue: "₹4,800",
    expectedProfit: "₹1,420",
    profitTag: "High ticket boost",
    whatsappTemplate:
      "बारिश के मौसम में खास! चाय और बिस्कुट का कॉम्बो पैक अन्नपूर्णा किराना पर विशेष छूट में उपलब्ध है। आज ही पधारें!",
  },
  {
    id: "rec-3",
    title: "Prompt Udhaar Repayment Instant Cashback",
    targetAudience: "Overdue credit customers (5 customers)",
    timing: "Today till 10:00 PM",
    discount: "Flat ₹25 instant cashback on full UPI settlement",
    expectedFootfall: "4 out of 5 settlements",
    expectedRevenue: "₹2,400 collected",
    expectedProfit: "₹2,300 cashflow recovered",
    profitTag: "Liquidity accelerator",
    whatsappTemplate:
      "नमस्ते! अपने बही-खाते का बकाया आज ही पेटीएम यूपीआई से चुकाएं और पाएं ₹25 का तुरंत डिस्काउंट। लिंक: upi://pay?pa=annapurna.kirana@paytm",
  },
];

export const counterUpsellRules = [
  {
    id: "upsell-1",
    primaryItem: "Amul Taaza Milk 500ml",
    primaryPrice: 28,
    primaryMargin: "5.2%",
    upsellItem: "Britannia Premium Toast / Rusk 200g",
    upsellPrice: 35,
    upsellMargin: "24.5%",
    combinedPrice: 63,
    ticketExpansion: "+125%",
    pitchEn: "Pairs naturally for morning breakfast. 73% of morning milk buyers take biscuits or rusk!",
    pitchHi: "सुबह के नाश्ते के लिए परफेक्ट कॉम्बो! 73% दूध ग्राहक टोस्ट या रस्क साथ में लेते हैं।",
    category: "Morning Breakfast Rush (7–10 AM)",
  },
  {
    id: "upsell-2",
    primaryItem: "Taj Mahal Tea 250g",
    primaryPrice: 190,
    primaryMargin: "8.8%",
    upsellItem: "Britannia Good Day Butter Cookies",
    upsellPrice: 25,
    upsellMargin: "22.0%",
    combinedPrice: 215,
    ticketExpansion: "+13%",
    pitchEn: "Peak 5 PM tea rush pairing. High-margin impulse buy placed at counter eye-level.",
    pitchHi: "शाम 5 बजे की चाय के समय काउंटर पर सबसे लोकप्रिय कॉम्बो! 22% हाई मार्जिन आइटम।",
    category: "Evening Tea Rush (5–8 PM)",
  },
  {
    id: "upsell-3",
    primaryItem: "Maggi 2-Minute Noodles 70g",
    primaryPrice: 14,
    primaryMargin: "7.1%",
    upsellItem: "Ching's Secret Schezwan Chutney Dip",
    upsellPrice: 20,
    upsellMargin: "28.0%",
    combinedPrice: 34,
    ticketExpansion: "+142%",
    pitchEn: "Popular snack upgrade among students and young adults. Liquidates slow-moving chutney stock!",
    pitchHi: "युवाओं और बच्चों में बेहद लोकप्रिय कॉम्बो! धीमी गति वाली चटनी का स्टॉक भी तेजी से निकलता है।",
    category: "Evening Snacking (4–7 PM)",
  },
  {
    id: "upsell-4",
    primaryItem: "Aashirvaad Shudh Chakki Atta 5kg",
    primaryPrice: 260,
    primaryMargin: "4.5%",
    upsellItem: "Amul Pure Cow Ghee 200ml",
    upsellPrice: 135,
    upsellMargin: "16.2%",
    combinedPrice: 395,
    ticketExpansion: "+52%",
    pitchEn: "Staple basket builder: families buying flour frequently upgrade with pure ghee for rotis.",
    pitchHi: "किराना महीने का राशन कॉम्बो: आटे के साथ शुद्ध देसी घी का सहज सुझाव।",
    category: "Monthly Grocery Basket",
  },
];

export const deadStockCombos = [
  {
    id: "combo-1",
    title: "Monsoon Chai & Biscuit Duo",
    items: "Taj Mahal Tea 250g + 2x Parle-G 250g",
    mrp: 250,
    comboPrice: 230,
    margin: "18.5%",
    benefitEn: "Liquidates 18 packs of Parle-G while securing ₹230 counter ticket.",
    benefitHi: "पारले-जी के 18 पैकेट तेजी से बिकेंगे और काउंटर पर ₹230 का बड़ा बिल बनेगा।",
  },
  {
    id: "combo-2",
    title: "Sunday Special Feast Pack",
    items: "Fortune Mustard Oil 1L + MDH Deggi Mirch 100g",
    mrp: 235,
    comboPrice: 215,
    margin: "17.0%",
    benefitEn: "Pairs everyday cooking oil with slow-moving specialty spice box.",
    benefitHi: "तेल के साथ धीमी गति वाले गरम मसाले का कॉम्बो बनाकर मार्जिन सुरक्षित करें।",
  },
];

export const loyaltyClubData = {
  title: "Paytm Soundbox Smart Loyalty Club",
  subtitle: "Zero-app UPI stamp cards designed for Indian Kirana stores",
  rewardRuleEn: "5th Visit = Flat ₹30 OFF automatically applied via Soundbox",
  rewardRuleHi: "हर 5वीं खरीदारी पर ₹30 की तुरंत छूट साउंडबॉक्स द्वारा लागू",
  stats: {
    registeredShoppers: 184,
    churnReductionPct: 42,
    repeatVisitsPerMonth: "4.1",
    baselineVisits: "2.4",
    totalRewardsDistributed: 1240,
    incrementalRevenueGenerated: 18400,
  },
  members: [
    {
      id: "mem-1",
      name: "Anita Gupta",
      phone: "+91 98333 44556",
      stamps: 5,
      maxStamps: 5,
      unlocked: true,
      statusEn: "🎉 ₹30 Reward Unlocked!",
      statusHi: "🎉 ₹30 छूट सक्रिय!",
      lastVisit: "Today (Morning)",
      spendThisMonth: "₹3,450",
    },
    {
      id: "mem-2",
      name: "Sunita Sharma",
      phone: "+91 98765 43210",
      stamps: 4,
      maxStamps: 5,
      unlocked: false,
      statusEn: "1 visit away from ₹30 reward",
      statusHi: "1 खरीदारी और ₹30 छूट के लिए",
      lastVisit: "Yesterday",
      spendThisMonth: "₹2,890",
    },
    {
      id: "mem-3",
      name: "Vikram Singh",
      phone: "+91 98123 45678",
      stamps: 3,
      maxStamps: 5,
      unlocked: false,
      statusEn: "2 visits away from reward",
      statusHi: "2 खरीदारी और ₹30 छूट के लिए",
      lastVisit: "3 days ago",
      spendThisMonth: "₹2,100",
    },
    {
      id: "mem-4",
      name: "Manoj Tiwari",
      phone: "+91 98444 55667",
      stamps: 2,
      maxStamps: 5,
      unlocked: false,
      statusEn: "3 visits away from reward",
      statusHi: "3 खरीदारी और ₹30 छूट के लिए",
      lastVisit: "5 days ago",
      spendThisMonth: "₹1,420",
    },
  ],
};



