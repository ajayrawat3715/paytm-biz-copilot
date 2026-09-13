export const translations = {
  en: {
    appName: "Bharat — Kirana Copilot",
    copilotOn: "Copilot on · Paytm AI",
    shopName: "Annapurna Kirana",
    shopArea: "Goripur, Patna",
    ownerName: "Ramesh",

    // Morning Brief
    morningGreeting: "Good morning, Ramesh.",
    quietSubtitle: "Today looks a little quiet.",
    forecastTitle: "Today's business forecast",
    forecastText: (day: string) => `Sales may be 16% lower than your usual ${day}.`,
    forecastSub: (sales: number, usual: number) =>
      `Current counter run-rate ₹${sales.toLocaleString("en-IN")} vs typical ₹${usual.toLocaleString("en-IN")} baseline.`,
    collectedSoFar: "Collected so far",
    last7Days: "Last 7 days",
    aiPrioritiesTitle: "AI Priorities to beat the quiet day",
    reviewAll: "Review all actions",

    p1Title: "Bring back inactive customers",
    p1Desc: "240 customers haven't visited recently.",
    p1Impact: "Estimated additional sales: ₹6,100",
    p1Action: "Review & send",

    p2Title: "Restock Parle biscuits",
    p2Desc: "Current stock: 0 units",
    p2Impact: "Estimated lost evening sales: ₹1,800",
    p2Action: "Review order",

    p3Title: "Collect overdue udhaar",
    p3Desc: "₹2,800 is overdue across 5 customers.",
    p3Impact: "5 customers need a friendly reminder.",
    p3Action: "Review reminders",

    // Worth Doing Today
    worthDoingTitle: "Worth doing today",
    mainAiBadge: "Main AI Recommendations",
    actionsReady: (ready: number, total: number) => `${ready} of ${total} actions ready`,
    whyAmISeeingThis: "Why am I seeing this?",
    problemDetected: "Problem Detected",
    whyDetected: "Why did Bharat detect this?",
    recommendedAction: "Recommended Action",
    expectedImpact: "Expected Impact",
    setAside: "Set aside for now",
    completed: "Completed",

    // Paytm Insights
    paytmInsightsTitle: "Paytm Business Insights",
    paytmDemoBadge: "Paytm Hackathon Demo · Simulated Data",
    todayPayments: "Today's payments",
    todayPaymentsSub: "Total counter + QR",
    upiTxns: "UPI transactions",
    upiTxnsSub: "↑ 14% vs yesterday",
    avgTxn: "Average transaction",
    avgTxnSub: "Across all modes",
    repeatCust: "Repeat customers",
    repeatCustSub: "Of weekly volume",
    upiRev: "UPI revenue",
    upiRevSub: "69.7% of total sales",
    trendTitle: "7-day sales & payment trend",
    trendSub: "UPI collections vs physical cash settled at Annapurna Kirana",

    // Udhaar
    udhaarTitle: "Udhaar Intelligence",
    udhaarSub: "AI-driven credit recovery & customer risk categorization",
    totalPending: "Total pending",
    dueToday: "Due today",
    overdue: "Overdue",
    riskSegmentation: "Customer Risk Segmentation",
    likelyToPay: "Likely to pay",
    highAttention: "High attention",
    bharatRecommendation: "Bharat Recommendation:",
    reviewReminders: "Review reminders",

    // Business Health
    healthTitle: "Business health",
    healthSub: "Weekly Kirana Vitals",
    sales: "Sales",
    customers: "Customers",
    inventory: "Inventory",
    udhaar: "Udhaar",
    itemsNeedAttention: "need attention today",

    // Opportunity Radar
    radarTitle: "💰 Bharat Opportunity Radar",
    radarSub: "Bharat continuously scans your business for opportunities.",
    totalOpportunity: "Total estimated opportunity",
    radarDisclaimer: "Estimated potential based on current business patterns. Actual results may vary.",

    // Daily Action Plan
    actionPlanTitle: "Today's Action Plan",
    actionPlanSub: "3 things Bharat recommends you do today.",
    reviewAllActions: "Review all actions",

    // Bharat Autopilot
    autopilotTitle: "Bharat Autopilot",
    autopilotSub: "Let Bharat prepare today's business actions for your approval.",
    autopilotNotice: "Demo simulation: Bharat never performs real financial transactions or sends real messages without manual confirmation.",
    actionsReadyHeader: "Today's actions are ready.",
    actionsPreparedCount: (count: number) => `${count} actions prepared`,
    approveSelected: "Approve selected actions",
    editActions: "Edit actions",
    cancel: "Cancel",
    backToDashboard: "Back to dashboard",

    // Business Memory
    memoryTitle: "Bharat Business Memory",
    memoryBadge: "Business Memory",
    memorySub: "Bharat learns your business preferences",

    // Navigation
    tourTitle: "Paytm AI Hackathon",
    tourSub: "60–90s Pitch Navigator",
    showSteps: "Show Demo Steps",
    hideSteps: "Hide",
    askBharatPlaceholder: "Ask in Hindi, Hinglish, or English…",
    mobileAskBar: "Ask Bharat about sales, stock, udhaar…",

    // Header Navigation
    navToday: "Today",
    navPulse: "Paytm Pulse",
    navInventory: "Inventory",
    navKhata: "Khata & CRM",
    navCampaigns: "Campaigns",

    // Page Hubs
    pulseTitle: "Paytm Pulse & Counter Analytics",
    pulseSub: "Real-time UPI velocity, hourly footfall heatmaps & Soundbox payouts",
    invTitle: "Smart Inventory Hub",
    invSub: "AI stock-out prediction, buffer controls, and 1-click supplier purchase orders",
    khataPageTitle: "Customer CRM & Digital Udhaar Khata",
    khataPageSub: "Credit risk scores, scannable Paytm QR codes, and polite WhatsApp follow-ups",
    campaignPageTitle: "AI Campaign & Growth Studio",
    campaignPageSub: "Interactive What-If promotion simulations, slow-hour boosts & WhatsApp broadcasts",

    // New Merchant Workflows
    voiceLedgerBtn: "Voice Khata",
    voiceLedgerTitle: "Voice-to-Ledger (बोल के खाता)",
    voiceLedgerSub: "Speak naturally in Hindi or Hinglish to record credit or collections without typing",
    dukanBandiBtn: "Day Close",
    dukanBandiTitle: "Evening Dukan Bandi (Day-End Close)",
    dukanBandiSub: "Instant 1-click audit of Cash drawer, Paytm Soundbox UPI settlements, and daily net profit",

    // Basket Booster & Loyalty
    basketBoosterTitle: "Smart Basket Booster & Upsell Engine",
    basketBoosterSub: "Pair high-margin impulse items with counter staples to expand ticket size from ₹146 to ₹185",
    deadStockTitle: "Dead Stock Clearance Combos",
    loyaltyBtn: "Loyalty Club",
    loyaltyTitle: "Paytm Soundbox Smart Loyalty Club",
    loyaltySub: "Zero-app UPI stamp cards to cut customer churn to quick-commerce by 42%",

    // Store Financial Pulse & Graph
    pnlBarTitle: "Store Financial Pulse & Graph",
    timeframeDaily: "Today (Daily)",
    timeframeWeekly: "This Week",
    timeframeMonthly: "This Month",
    timeframeYearly: "This Year",
    metricSales: "Total Sales",
    metricExpenses: "Shop Expenses",
    metricLoss: "Loss & Wastage",
    metricProfit: "Net Profit",
    metricMargin: "Net Margin",
    viewGraph: "Show Graph",
    hideGraph: "Hide Graph",
    revenueBreakdown: "Revenue Allocation Waterfall",
    revenueBreakdownSub: "Where counter money goes: Expenses + Spoilage + Your Net Profit",
    timelineTrends: "Comparative Financial Trends",
    timelineTrendsSub: "Sales vs Expenses vs Net Profit over time",
    viewItemized: "View Itemized Details",
    breakdownModalTitle: "Expense & Wastage Breakdown",
    breakdownModalSub: "Transparent Kirana bookkeeping for Ramesh",
  },
  hi: {
    // Opportunity Radar
    radarTitle: "💰 भारत अवसर रडार",
    radarSub: "भारत आपके व्यापार में संभावित अवसरों की निरंतर निगरानी करता है।",
    totalOpportunity: "कुल अनुमानित व्यावसायिक अवसर",
    radarDisclaimer: "व्यापार के मौजूदा रुझानों पर आधारित अनुमानित क्षमता। वास्तविक परिणाम भिन्न हो सकते हैं।",

    // Daily Action Plan
    actionPlanTitle: "आज की कार्य योजना",
    actionPlanSub: "3 आवश्यक कार्य जो भारत आज करने की सलाह देता है।",
    reviewAllActions: "सभी कार्य देखें व स्वीकृत करें",

    // Bharat Autopilot
    autopilotTitle: "भारत ऑटोपायलट",
    autopilotSub: "भारत को आज की व्यावसायिक कार्रवाइयां आपकी स्वीकृति के लिए तैयार करने दें।",
    autopilotNotice: "डेमो सिमुलेशन: भारत आपकी प्रत्यक्ष अनुमति के बिना कोई वास्तविक वित्तीय लेनदेन या संदेश नहीं भेजता।",
    actionsReadyHeader: "आज की सभी कार्रवाइयां तैयार हैं।",
    actionsPreparedCount: (count: number) => `${count} कार्रवाइयां तैयार`,
    approveSelected: "चयनित कार्रवाइयां स्वीकृत करें",
    editActions: "संशोधित करें",
    cancel: "रद्द करें",
    backToDashboard: "डैशबोर्ड पर लौटें",

    // Business Memory
    memoryTitle: "भारत बिजनेस मेमोरी",
    memoryBadge: "बिजनेस मेमोरी",
    memorySub: "भारत आपकी व्यावसायिक प्राथमिकताओं को समझता है",
    appName: "भारत — किराना कोपायलट",
    copilotOn: "कोपायलट सक्रिय · पेटीएम एआई",
    shopName: "अन्नपूर्णा किराना",
    shopArea: "गोरईपुर, पटना",
    ownerName: "रमेश जी",

    // Morning Brief
    morningGreeting: "शुभ प्रभात, रमेश जी।",
    quietSubtitle: "आज का दिन थोड़ा शांत लग रहा है।",
    forecastTitle: "आज का व्यापार पूर्वानुमान",
    forecastText: (day: string) => `आज की बिक्री आपके सामान्य ${day} से 16% कम रह सकती है।`,
    forecastSub: (sales: number, usual: number) =>
      `अभी तक की बिक्री ₹${sales.toLocaleString("en-IN")} बनाम सामान्य ₹${usual.toLocaleString("en-IN")} का स्तर।`,
    collectedSoFar: "अभी तक की कुल वसूली",
    last7Days: "पिछले 7 दिन",
    aiPrioritiesTitle: "शांत दिन में बिक्री बढ़ाने के 3 AI प्राथमिकताएं",
    reviewAll: "सभी सुझाव देखें",

    p1Title: "निष्क्रिय ग्राहकों को वापस लाएं",
    p1Desc: "240 ग्राहक पिछले 15+ दिनों से नहीं आए हैं।",
    p1Impact: "अनुमानित अतिरिक्त बिक्री: ₹6,100",
    p1Action: "ऑफर देखें और भेजें",

    p2Title: "पारले बिस्कुट तुरंत रीस्टॉक करें",
    p2Desc: "वर्तमान स्टॉक: 0 पैकेट",
    p2Impact: "शाम की संभावित बिक्री का नुकसान: ₹1,800",
    p2Action: "ऑर्डर देखें",

    p3Title: "अतिदेय उधार की वसूली करें",
    p3Desc: "5 ग्राहकों पर ₹2,800 का उधार बकाया है।",
    p3Impact: "5 ग्राहकों को विनम्र रिमाइंडर की जरूरत है।",
    p3Action: "रिमाइंडर देखें",

    // Worth Doing Today
    worthDoingTitle: "आज करने योग्य मुख्य कार्य",
    mainAiBadge: "मुख्य AI सिफारिशें",
    actionsReady: (ready: number, total: number) => `${ready}/${total} कार्य तैयार`,
    whyAmISeeingThis: "यह मुझे क्यों दिख रहा है?",
    problemDetected: "पहचानी गई समस्या",
    whyDetected: "भारत ने यह क्यों पहचाना?",
    recommendedAction: "अनुशंसित कार्रवाई",
    expectedImpact: "अपेक्षित लाभ / प्रभाव",
    setAside: "बाद के लिए रखें",
    completed: "पूर्ण हुआ",

    // Paytm Insights
    paytmInsightsTitle: "पेटीएम बिज़नेस इनसाइट्स",
    paytmDemoBadge: "पेटीएम हैकथॉन डेमो · सिमुलेटेड डेटा",
    todayPayments: "आज के कुल पेमेंट्स",
    todayPaymentsSub: "काउंटर बिक्री + क्यूआर",
    upiTxns: "यूपीआई लेनदेन",
    upiTxnsSub: "कल से ↑ 14% अधिक",
    avgTxn: "औसत बिल राशि",
    avgTxnSub: "सभी माध्यमों में",
    repeatCust: "पुराने ग्राहक",
    repeatCustSub: "साप्ताहिक बिक्री का 68%",
    upiRev: "यूपीआई से राजस्व",
    upiRevSub: "कुल बिक्री का 69.7%",
    trendTitle: "7-दिवसीय बिक्री व भुगतान रुझान",
    trendSub: "पेटीएम यूपीआई बनाम काउंटर नकद लेनदेन",

    // Udhaar
    udhaarTitle: "उधार इंटेलिजेंस",
    udhaarSub: "AI द्वारा संचालित उधार वसूली व ग्राहक जोखिम वर्गीकरण",
    totalPending: "कुल बकाया उधार",
    dueToday: "आज देय",
    overdue: "तय समय से लेट",
    riskSegmentation: "ग्राहक जोखिम वर्गीकरण",
    likelyToPay: "समय पर देने वाले",
    highAttention: "अति ध्यान दें",
    bharatRecommendation: "भारत की सलाह:",
    reviewReminders: "रिमाइंडर देखें",

    // Business Health
    healthTitle: "व्यापार स्वास्थ्य",
    healthSub: "साप्ताहिक किराना संकेतक",
    sales: "बिक्री",
    customers: "ग्राहक",
    inventory: "स्टॉक",
    udhaar: "उधार",
    itemsNeedAttention: "आइटम पर तुरंत ध्यान दें",

    // Navigation
    tourTitle: "पेटीएम एआई हैकथॉन",
    tourSub: "60–90 सेकंड पिच नेविगेटर",
    showSteps: "डेमो चरण दिखाएं",
    hideSteps: "छिपाएं",
    askBharatPlaceholder: "हिंदी या हिंग्लिश में कुछ भी पूछें…",
    mobileAskBar: "भारत से बिक्री, स्टॉक, उधार के बारे में पूछें…",

    // Header Navigation
    navToday: "आज",
    navPulse: "पेटीएम पल्स",
    navInventory: "स्टॉक भंडार",
    navKhata: "खाता व ग्राहक",
    navCampaigns: "ऑफर स्टूडियो",

    // Page Hubs
    pulseTitle: "पेटीएम पल्स व काउंटर विश्लेषण",
    pulseSub: "रियल-टाइम यूपीआई गति, घंटेवार भीड़ और साउंडबॉक्स भुगतान",
    invTitle: "स्मार्ट स्टॉक और सप्लायर हब",
    invSub: "एआई स्टॉक समाप्ति पूर्वानुमान और 1-क्लिक सप्लायर ऑर्डर",
    khataPageTitle: "ग्राहक संबंध व डिजिटल उधार खाता",
    khataPageSub: "क्रेडिट जोखिम स्कोर, स्कैन करने योग्य पेटीएम क्यूआर और व्हाट्सएप रिमाइंडर",
    campaignPageTitle: "एआई ऑफर व विकास स्टूडियो",
    campaignPageSub: "प्रमोशन सिमुलेशन, मंदे घंटों के बूस्टर व व्हाट्सएप ब्रॉडकास्ट",

    // New Merchant Workflows
    voiceLedgerBtn: "बोल के खाता",
    voiceLedgerTitle: "बोल के खाता (Voice-to-Ledger)",
    voiceLedgerSub: "हिंदी या हिंग्लिश में बोलें, भारत तुरंत बही-खाता दर्ज कर साउंडबॉक्स पर पुष्टि करेगा",
    dukanBandiBtn: "दुकान बंदी",
    dukanBandiTitle: "दुकान बंदी हिसाब (Day-End Close)",
    dukanBandiSub: "गल्ला नकद, पेटीएम साउंडबॉक्स और उधारी का 1-क्लिक त्वरित मिलान व नेट मुनाफा",

    // Basket Booster & Loyalty
    basketBoosterTitle: "स्मार्ट बास्केट बूस्टर (Counter Upsell)",
    basketBoosterSub: "दाल-दूध के साथ 24% हाई-मार्जिन स्नैक्स जोड़कर काउंटर बिल ₹146 से ₹185 तक बढ़ाएं",
    deadStockTitle: "धीमी गति वाले स्टॉक के कॉम्बो बंडल",
    loyaltyBtn: "लॉयल्टी क्लब",
    loyaltyTitle: "पेटीएम साउंडबॉक्स स्मार्ट लॉयल्टी क्लब",
    loyaltySub: "बिना ऐप के पेटीएम यूपीआई स्टैम्प कार्ड: ग्राहकों को ब्लिंकिट/ज़ेप्टो जाने से 42% रोकें",

    // Store Financial Pulse & Graph
    pnlBarTitle: "दुकान का हिसाब-किताब व वित्तीय ग्राफ",
    timeframeDaily: "आज (दैनिक)",
    timeframeWeekly: "इस हफ्ते (साप्ताहिक)",
    timeframeMonthly: "इस महीने (मासिक)",
    timeframeYearly: "इस साल (वार्षिक)",
    metricSales: "कुल बिक्री",
    metricExpenses: "दुकान खर्च",
    metricLoss: "नुकसान / वेस्टेज",
    metricProfit: "शुद्ध मुनाफा",
    metricMargin: "शुद्ध मार्जिन",
    viewGraph: "ग्राफ देखें",
    hideGraph: "ग्राफ छिपाएं",
    revenueBreakdown: "गल्ला बंटवारा (Kirana Revenue Split)",
    revenueBreakdownSub: "काउंटर की कमाई का हिसाब: माल खरीद + वेस्टेज + आपकी शुद्ध बचत",
    timelineTrends: "समयवार वित्तीय तुलना (Timeline Trends)",
    timelineTrendsSub: "बिक्री, खर्च और शुद्ध मुनाफे का तुलनात्मक बार ग्राफ",
    viewItemized: "विस्तृत ब्योरा देखें",
    breakdownModalTitle: "खर्च व नुकसान का विस्तृत ब्योरा",
    breakdownModalSub: "अन्नपूर्णा किराना के लिए पारदर्शी बही-खाता",
  },
};
