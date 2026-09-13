import {
  businessHealthData,
  campaignSimulationData,
  inventoryIntelligenceData,
  morningForecast,
  paytmInsightsData,
  shopInfo,
  udhaarAIData,
} from "./mock-data";

export type LanguageMode = "en" | "hi";

export interface ChatResponse {
  text: string;
  suggestedAction?: {
    label: string;
    type: "campaign" | "inventory" | "udhaar";
  };
}

export function getCopilotResponse(
  query: string,
  lang: LanguageMode = "en",
): ChatResponse {
  const q = query.toLowerCase().trim();

  // Detect if the user query contains Devanagari Hindi characters
  const hasDevanagari = /[\u0900-\u097F]/.test(query);
  // If query is typed in Hindi script, respect Hindi regardless.
  // Otherwise use the user's explicit language preference.
  const isHindi = hasDevanagari || lang === "hi";

  // 1. Tuesday sales / why slow / sales drop / बिक्री कम
  if (
    q.includes("tuesday") ||
    q.includes("slow") ||
    q.includes("quiet") ||
    q.includes("sales drop") ||
    q.includes("aaj kam") ||
    q.includes("sales kam") ||
    q.includes("bikri kam") ||
    q.includes("manda") ||
    q.includes("बिक्री") ||
    q.includes("मंगलवार") ||
    q.includes("धीमी") ||
    q.includes("मंदा") ||
    q.includes("कम क्यों")
  ) {
    if (isHindi) {
      return {
        text: `मंगलवार की बिक्री आपके सामान्य दिनों से लगभग 16% कम चल रही है (आज ₹18,420 बनाम सामान्य ₹21,900)।

इसके 3 मुख्य कारण पाए गए हैं:
• 240 नियमित ग्राहक पिछले 15+ दिनों से दुकान नहीं आए हैं
• शाम के समय काउंटर ट्रांजेक्शन में 21% की कमी है
• ग्राहकों का औसत बास्केट साइज थोड़ा कम है

💡 भारत की सलाह: इन 240 पुराने ग्राहकों को 10% मंगलवार स्पेशल ऑफर भेजें।
अनुमानित अतिरिक्त बिक्री: ₹6,100।`,
        suggestedAction: {
          label: "10% ऑफर अभियान देखें व भेजें",
          type: "campaign",
        },
      };
    }
    return {
      text: `Tuesday sales are running about 16% below your normal baseline (₹18,420 today vs ₹21,900 usual).

I identified 3 likely reasons:
• 240 regular customers haven't visited in 15+ days
• Evening rush transactions are down 21%
• Average basket size is 8% lower than normal

💡 Recommendation: Launch a 10% Tuesday evening flash offer to inactive customers.
Estimated revenue lift: ₹6,100.`,
      suggestedAction: {
        label: "Review & launch campaign",
        type: "campaign",
      },
    };
  }

  // 2. Aaj kya focus karun? / Priorities / आज क्या करूं / प्राथमिकता
  if (
    q.includes("focus") ||
    q.includes("kya karun") ||
    q.includes("kya karna") ||
    q.includes("priorit") ||
    q.includes("increase sales") ||
    q.includes("sales kaise badha") ||
    q.includes("aaj kya") ||
    q.includes("फोकस") ||
    q.includes("क्या करूं") ||
    q.includes("क्या करना") ||
    q.includes("प्राथमिकता") ||
    q.includes("बिक्री कैसे बढ़ाएं") ||
    q.includes("सलाह")
  ) {
    if (isHindi) {
      return {
        text: `नमस्ते रमेश जी! आज अन्नपूर्णा किराना के लिए 3 सबसे जरूरी प्राथमिकताएं:

1. 🎯 **240 पुराने ग्राहकों को वापस लाएं**: 10% शाम के ऑफर से ₹6,100 की अतिरिक्त बिक्री संभव है।
2. 📦 **पारले-जी बिस्कुट रीस्टॉक करें**: स्टॉक 0 हो चुका है, शाम तक ₹1,800 की बिक्री का नुकसान रुक सकता है।
3. 📒 **₹2,800 का ओवरड्यू उधार वसूलें**: 5 ग्राहकों को आदरपूर्वक पेटीएम यूपीआई लिंक के साथ रिमाइंडर भेजें।

सबसे पहले 10% ग्राहक ऑफर स्वीकृत करने की सलाह है!`,
        suggestedAction: {
          label: "10% अभियान शुरू करें",
          type: "campaign",
        },
      };
    }
    return {
      text: `Hello Ramesh ji! Here are your top 3 prioritized growth actions for today:

1. 🎯 **Re-engage 240 lapsed customers**: 10% evening flash offer brings ₹6,100 in potential sales.
2. 📦 **Restock Parle biscuits**: Current stock is 0; saves ₹1,800 in lost evening rush sales.
3. 📒 **Collect overdue udhaar**: ₹2,800 across 5 trusted customers ready for polite reminders.

Start with the inactive customer campaign before the 4 PM rush!`,
      suggestedAction: {
        label: "Review & send campaign",
        type: "campaign",
      },
    };
  }

  // 3. Udhaar / Credit / Reminders / उधार / खाता / वसूली
  if (
    q.includes("udhaar") ||
    q.includes("udhar") ||
    q.includes("credit") ||
    q.includes("remind") ||
    q.includes("bahi") ||
    q.includes("khata") ||
    q.includes("overdue") ||
    q.includes("pending") ||
    q.includes("vasooli") ||
    q.includes("उधार") ||
    q.includes("उधारी") ||
    q.includes("खाता") ||
    q.includes("बही") ||
    q.includes("बाकी") ||
    q.includes("वसूली") ||
    q.includes("रिमाइंडर")
  ) {
    if (isHindi) {
      return {
        text: `अन्नपूर्णा किराना का कुल बकाया उधार ₹12,840 है, जिसमें से ₹2,800 की राशि 5 ग्राहकों पर ओवरड्यू हो चुकी है:

• **राजेश कुमार**: ₹800 (8 दिन से बाकी)
• **सुनीता देवी**: ₹650 (12 दिन से बाकी)
• **अमित वर्मा**: ₹500 (5 दिन से बाकी)
• **मनोज सिंह**: ₹450 (7 दिन से बाकी)
• **विक्रम पटेल**: ₹400 (14 दिन से बाकी)

इन सभी ग्राहकों का पुराना भुगतान रिकॉर्ड अच्छा है। इनके लिए विनम्र व्हाट्सएप मैसेज और स्कैन करने योग्य पेटीएम क्यूआर तैयार है।`,
        suggestedAction: {
          label: "उधार रिमाइंडर देखें व भेजें",
          type: "udhaar",
        },
      };
    }
    return {
      text: `Total pending credit in your khata is ₹12,840. Currently ₹2,800 is overdue across 5 trusted customers:

• **Rajesh Kumar**: ₹800 (8 days overdue)
• **Sunita Devi**: ₹650 (12 days overdue)
• **Amit Verma**: ₹500 (5 days overdue)
• **Manoj Singh**: ₹450 (7 days overdue)
• **Vikram Patel**: ₹400 (14 days overdue)

All 5 have high past trust scores. Friendly WhatsApp reminder drafts with your dynamic Paytm UPI QR are ready to send.`,
      suggestedAction: {
        label: "Review reminders",
        type: "udhaar",
      },
    };
  }

  // 4. Inventory / Reorder / Stock / सामान / स्टॉक / ऑर्डर
  if (
    q.includes("reorder") ||
    q.includes("order") ||
    q.includes("stock") ||
    q.includes("parle") ||
    q.includes("saman") ||
    q.includes("maal") ||
    q.includes("bread") ||
    q.includes("cold drink") ||
    q.includes("स्टॉक") ||
    q.includes("सामान") ||
    q.includes("माल") ||
    q.includes("ऑर्डर") ||
    q.includes("रीस्टॉक") ||
    q.includes("पारले") ||
    q.includes("बिस्कुट") ||
    q.includes("खत्म")
  ) {
    if (isHindi) {
      return {
        text: `शाम 5 बजे की चाय की भीड़ से पहले तुरंत रीस्टॉक करने वाले उत्पाद:

• 📦 **पारले-जी बिस्कुट (100g)**: वर्तमान स्टॉक **0** है। शाम की औसत मांग 12 पैकेट है। **24 पैकेट** शर्मा डिस्ट्रीब्यूटर्स से तुरंत मंगवाएं (थोक लागत: ₹480, सुरक्षित बिक्री: ₹1,800)।
• 🥤 **कोल्ड ड्रिंक्स (250ml)**: केवल 4 बोतल बची हैं, 30 का ऑर्डर भेजें।
• 🍞 **ताज़ा ब्रेड**: केवल 2 पैकेट बचे हैं, 20 का ऑर्डर भेजें।

शर्मा डिस्ट्रीब्यूटर्स के लिए 1-क्लिक व्हाट्सएप परचेज ऑर्डर तैयार है।`,
        suggestedAction: {
          label: "शर्मा डिस्ट्रीब्यूटर्स का ऑर्डर भेजें",
          type: "inventory",
        },
      };
    }
    return {
      text: `Inventory items requiring immediate reorder before 5 PM:

• 📦 **Parle biscuits (Gold 100g)**: Current stock is **0**. Expected evening demand is 12 units. Reorder **24 units** from Sharma Distributors (wholesale cost: ₹480, protects ₹1,800 in lost sales).
• 🥤 **Cold drinks (250ml)**: 4 remaining, reorder 30 units from Patna Beverages.
• 🍞 **Fresh Bread**: 2 remaining, reorder 20 units from Daily Bake Co.

I have prepared the purchase order for Sharma Distributors.`,
      suggestedAction: {
        label: "Review order with Sharma Dist.",
        type: "inventory",
      },
    };
  }

  // 5. Paytm / Soundbox / UPI / QR / पेटीएम / साउंडबॉक्स
  if (
    q.includes("paytm") ||
    q.includes("upi") ||
    q.includes("qr") ||
    q.includes("payment") ||
    q.includes("soundbox") ||
    q.includes("पेटीएम") ||
    q.includes("साउंडबॉक्स") ||
    q.includes("यूपीआई") ||
    q.includes("क्यूआर") ||
    q.includes("पेमेंट") ||
    q.includes("कलेक्शन")
  ) {
    if (isHindi) {
      return {
        text: `आज का पेटीएम साउंडबॉक्स और डिजिटल भुगतान विश्लेषण:

• **कुल काउंटर भुगतान**: ₹18,420 (126 यूपीआई लेनदेन)
• **पेटीएम साउंडबॉक्स कलेक्शन**: ₹12,840 (कुल बिक्री का 69.7%)
• **औसत बिल (टिकट साइज)**: ₹146
• **पेटीएम एआई इनसाइट**: पेटीएम यूपीआई से भुगतान करने वाले ग्राहक नकद ग्राहकों से **18% अधिक खरीदारी** करते हैं (औसत ₹172 बनाम ₹146)।

साउंडबॉक्स व क्यूआर काउंटर पर आगे रखने से बास्केट साइज और अधिक बढ़ेगा।`,
      };
    }
    return {
      text: `Here is your Paytm & UPI performance snapshot:

• **Total payments today**: ₹18,420 across 126 UPI transactions
• **UPI collection**: ₹12,840 (69.7% of daily turnover)
• **Average basket**: ₹146
• **Paytm Intelligence**: UPI customers spend **18% more per transaction** than cash customers (₹172 vs ₹146).

Keep your Paytm QR and Soundbox prominently placed on the billing counter!`,
    };
  }

  // 6. Profit / Expenses / Loss / Margin / मुनाफा / खर्च / नुकसान
  if (
    q.includes("profit") ||
    q.includes("margin") ||
    q.includes("expense") ||
    q.includes("loss") ||
    q.includes("munafa") ||
    q.includes("kharch") ||
    q.includes("nuksan") ||
    q.includes("bachat") ||
    q.includes("मुनाफा") ||
    q.includes("खर्च") ||
    q.includes("नुकसान") ||
    q.includes("मार्जिन") ||
    q.includes("कमाई") ||
    q.includes("बचत")
  ) {
    if (isHindi) {
      return {
        text: `अन्नपूर्णा किराना का दैनिक वित्तीय विश्लेषण:

• 💰 **कुल बिक्री**: ₹18,420 (साउंडबॉक्स ₹12,840 + नकद ₹5,580)
• 🧾 **दुकान खर्च**: ₹14,200 (थोक माल ₹13,450 + बिजली/हेल्पर ₹750)
• ⚠️ **नुकसान/वेस्टेज**: ₹800 (दूध/ब्रेड खराबी ₹520 + पैकेजिंग रिसाव ₹280)
• ✨ **शुद्ध दैनिक मुनाफा**: +₹3,420 (**18.6% शुद्ध मार्जिन**)

दुकान बंदी के समय आपका कैश गल्ला 100% सही मिलान (₹0 अंतर) पर है।`,
      };
    }
    return {
      text: `Annapurna Kirana's Daily Financial Summary:

• 💰 **Total Sales**: ₹18,420 (Soundbox UPI ₹12,840 + Drawer Cash ₹5,580)
• 🧾 **Shop Expenses**: ₹14,200 (Wholesale stock ₹13,450 + Utilities/Helper ₹750)
• ⚠️ **Wastage & Spoilage**: ₹800 (Milk/bread expiry ₹520 + Packaging leakage ₹280)
• ✨ **Net Daily Profit**: +₹3,420 (**18.6% net margin**)

Your drawer cash audit reconciles with 100% zero-variance accuracy.`,
    };
  }

  // 7. Loyalty / Retention / Customers / लॉयल्टी / ग्राहक
  if (
    q.includes("loyalty") ||
    q.includes("customer") ||
    q.includes("stamp") ||
    q.includes("churn") ||
    q.includes("blinkit") ||
    q.includes("zepto") ||
    q.includes("लॉयल्टी") ||
    q.includes("ग्राहक") ||
    q.includes("स्टैम्प")
  ) {
    if (isHindi) {
      return {
        text: `पेटीएम साउंडबॉक्स स्मार्ट लॉयल्टी क्लब की स्थिति:

• 👥 **सक्रिय सदस्य**: 24 स्थानीय मोहल्ले के ग्राहक
• 🏆 **अनीता गुप्ता**: 5वीं खरीदारी पूरी (₹30 की छूट साउंडबॉक्स पर घोषित हुई)
• 🎫 **सुनीता शर्मा**: 4/5 स्टैम्प (केवल 1 खरीदारी दूर)
• 🛡️ **क्विक-कॉमर्स सुरक्षा**: पड़ोस के ग्राहकों का ब्लिंकिट/ज़ेप्टो पर जाना 42% कम हुआ।`,
        suggestedAction: {
          label: "लॉयल्टी क्लब खोलें",
          type: "campaign",
        },
      };
    }
    return {
      text: `Paytm Soundbox Smart Loyalty Club status:

• 👥 **Active Members**: 24 local neighborhood shoppers
• 🏆 **Anita Gupta**: 5th visit completed! ₹30 reward announced on Soundbox
• 🎫 **Sunita Sharma**: 4/5 stamps (1 visit away from reward)
• 🛡️ **Quick-Commerce Defense**: 42% reduction in customer churn to Blinkit/Zepto.`,
      suggestedAction: {
        label: "Open Loyalty Club",
        type: "campaign",
      },
    };
  }

  // Default fallback conversational response
  if (isHindi) {
    return {
      text: `नमस्ते रमेश जी! मैं अन्नपूर्णा किराना के लाइव डेटा को निरंतर मॉनिटर कर रहा हूँ:
• 📊 **आज की बिक्री**: ₹18,420 (सामान्य से 16% कम चल रही है)
• 🎯 **240 पुराने ग्राहक**: 10% ऑफर से ₹6,100 की संभावित बिक्री
• 📒 **₹2,800 ओवरड्यू उधार**: 5 ग्राहकों से वसूलने के लिए रिमाइंडर तैयार
• 📦 **पारले बिस्कुट**: शाम की चाय की भीड़ से पहले 0 स्टॉक पर है

आप बिक्री, उधारी, स्टॉक या मुनाफे के बारे में नीचे दिए गए सुझावों पर टैप करके पूछ सकते हैं!`,
    };
  }
  return {
    text: `Hello Ramesh ji! I'm actively monitoring Annapurna Kirana's live business:
• 📊 **Today's Sales**: ₹18,420 (running 16% behind usual ₹21,900 baseline)
• 🎯 **Inactive Customers**: 240 accounts can generate ₹6,100 with a 10% offer
• 📒 **Overdue Credit**: ₹2,800 across 5 customers needs a gentle WhatsApp nudge
• 📦 **Low Stock**: Parle biscuits at 0 stock before evening rush

Feel free to tap any suggestion below or ask about sales, stock, or udhaar!`,
  };
}
