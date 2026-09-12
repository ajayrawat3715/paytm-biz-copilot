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

  // 1. Tuesday sales / why slow / sales drop
  if (
    q.includes("tuesday") ||
    q.includes("slow") ||
    q.includes("quiet") ||
    q.includes("sales drop") ||
    q.includes("aaj kam") ||
    q.includes("sales kam") ||
    q.includes("bikri kam")
  ) {
    if (lang === "hi") {
      return {
        text: `Tuesday ki sale aapke aam din se lagbhag 16% kam chal rahi hai (₹18,420 vs ₹21,900 usual).

Mujhe 3 mukhya kaaran mile:
• 240 regular customers pichle 15+ din se nahi aaye hain
• Shaam ki transactions me 21% ki kami hai
• Average basket size thoda kam hai

Mera sujhav hai: Inactive customers ko 10% Tuesday offer bhejiye.
Anumaanit atirikt bikri: ₹6,100.`,
        suggestedAction: {
          label: "Review & send campaign",
          type: "campaign",
        },
      };
    }
    return {
      text: `Tuesday sales are about 16% below your usual level (₹18,420 today vs ₹21,900 usual).

I found 3 likely reasons:
• 240 regular customers haven't visited in 15+ days
• Evening transactions are down 21%
• Average basket size is 8% lower than normal

I'd recommend sending a 10% Tuesday offer to inactive customers.
Estimated additional sales: ₹6,100.`,
      suggestedAction: {
        label: "Review & send campaign",
        type: "campaign",
      },
    };
  }

  // 2. Aaj kya focus karun? / What to focus on today / How to increase sales
  if (
    q.includes("focus") ||
    q.includes("kya karun") ||
    q.includes("priorit") ||
    q.includes("increase sales") ||
    q.includes("sales kaise badha") ||
    q.includes("aaj kya karna")
  ) {
    if (lang === "hi") {
      return {
        text: `Namaste Ramesh ji, aaj ke 3 mukhya priorities ye hain:

1. **240 purane grahako ko wapas layein**: 10% offer se ₹6,100 ki atirikt bikri sambhav hai.
2. **Parle biscuits mangwayein**: Stock 0 ho chuka hai, shaam tak ₹1,800 ka nuksan ho sakta hai.
3. **₹2,800 ka overdue udhaar collect karein**: 5 grahako ko polite WhatsApp reminder bhejein.

Sabse pehle 10% customer campaign approve karne ki salah dunga.`,
        suggestedAction: {
          label: "Launch 10% campaign",
          type: "campaign",
        },
      };
    }
    return {
      text: `Namaste Ramesh ji. Today requires quick action across 3 key fronts:

1. **Re-engage 240 lapsed customers**: 10% evening flash offer brings ₹6,100 in potential sales.
2. **Restock Parle biscuits**: Current stock is 0; saves ₹1,800 in lost evening rush sales.
3. **Collect overdue udhaar**: ₹2,800 across 5 trusted customers ready for polite reminders.

Start with the inactive customer campaign before the 4 PM rush!`,
      suggestedAction: {
        label: "Review & send campaign",
        type: "campaign",
      },
    };
  }

  // 3. Who should I remind for udhaar? / Kaun udhaar nahi diya hai?
  if (
    q.includes("udhaar") ||
    q.includes("udhar") ||
    q.includes("remind") ||
    q.includes("bahi") ||
    q.includes("khata") ||
    q.includes("kaun") ||
    q.includes("pending") ||
    q.includes("overdue")
  ) {
    if (lang === "hi") {
      return {
        text: `Aapka kul pending udhaar ₹12,840 hai, jisme se ₹2,800 5 grahako par overdue ho chuka hai:

• **Rajesh Kumar**: ₹800 (8 din late)
• **Sunita Devi**: ₹650 (12 din late)
• **Amit Verma**: ₹500 (5 din late)
• **Manoj Singh**: ₹450 (7 din late)
• **Vikram Patel**: ₹400 (14 din late)

Sabhi ke liye polite WhatsApp reminder Paytm UPI link ke sath ready hai. Ek click me bhejein.`,
        suggestedAction: {
          label: "Review reminders",
          type: "udhaar",
        },
      };
    }
    return {
      text: `Total pending credit is ₹12,840. Currently ₹2,800 is overdue across 5 regular customers:

• **Rajesh Kumar**: ₹800 (8 days late)
• **Sunita Devi**: ₹650 (12 days late)
• **Amit Verma**: ₹500 (5 days late)
• **Manoj Singh**: ₹450 (7 days late)
• **Vikram Patel**: ₹400 (14 days late)

All 5 have high past repayment trust. I recommend sending a friendly WhatsApp message with your Paytm QR/UPI link.`,
      suggestedAction: {
        label: "Review reminders",
        type: "udhaar",
      },
    };
  }

  // 4. What should I reorder? / Aaj kya order karna chahiye? / Stock
  if (
    q.includes("reorder") ||
    q.includes("order") ||
    q.includes("stock") ||
    q.includes("parle") ||
    q.includes("saman") ||
    q.includes("mangwa")
  ) {
    if (lang === "hi") {
      return {
        text: `Turant dhyan dene yogya inventory:

• **Parle biscuits (Gold 100g)**: Stock abhi **0** hai. Shaam ki maang 12 units hai. **24 units** Sharma Distributors se turant mangwayein (wholesale cost: ₹480, bachi hui bikri: ₹1,800).
• **Cold drinks (250ml)**: 4 bache hain, 30 ka order bhejein.
• **Fresh Bread**: 2 bache hain, 20 ka order bhejein.

Sharma Distributors ka PO draft taiyar hai.`,
        suggestedAction: {
          label: "Review order with Sharma Dist.",
          type: "inventory",
        },
      };
    }
    return {
      text: `Inventory items requiring immediate reorder before 5 PM:

• **Parle biscuits (Gold 100g)**: Current stock is **0**. Expected evening demand is 12 units. Reorder **24 units** from Sharma Distributors (wholesale cost: ₹480, protects ₹1,800 in lost sales).
• **Cold drinks (250ml)**: 4 remaining, reorder 30 units from Patna Beverages.
• **Fresh Bread**: 2 remaining, reorder 20 units from Daily Bake Co.

I have prepared the purchase order for Sharma Distributors.`,
      suggestedAction: {
        label: "Review order with Sharma Dist.",
        type: "inventory",
      },
    };
  }

  // 5. Paytm / UPI insights / payment
  if (
    q.includes("paytm") ||
    q.includes("upi") ||
    q.includes("qr") ||
    q.includes("payment") ||
    q.includes("online")
  ) {
    if (lang === "hi") {
      return {
        text: `Aapke aaj ke Paytm aur UPI aakde:

• **Kul payments**: ₹18,420 (126 UPI transactions)
• **UPI revenue**: ₹12,840 (lagbhag 70% of total)
• **Average ticket size**: ₹146
• **Paytm Insight**: Aapke UPI grahak cash walo se **18% zyada kharch** karte hain (avg ₹172 vs ₹146).

Paytm Soundbox aur QR counter par aage rakhne se basket size aur badh sakti hai.`,
      };
    }
    return {
      text: `Here is your Paytm & UPI performance snapshot:

• **Total payments today**: ₹18,420 across 126 UPI transactions
• **UPI collection**: ₹12,840 (69.7% of daily turnover)
• **Average basket**: ₹146
• **Paytm Intelligence**: UPI customers spend **18% more per transaction** than cash customers (₹172 vs ₹146).

Keep your Paytm QR prominently placed on the billing counter!`,
    };
  }

  // Default fallback conversational response
  if (lang === "hi") {
    return {
      text: `Namaste Ramesh ji. Main Annapurna Kirana ke live data ko monitor kar raha hoon:
• Aaj ki bikri: ₹18,420 (aam taur par ₹21,900 hoti hai — 16% kam)
• 240 inactive grahako ke liye 10% offer se ₹6,100 ban sakte hain
• ₹2,800 overdue udhaar 5 grahako se lena baaki hai
• Parle biscuits 0 stock par hain

Aap inme se kiske baare me janna chahte hain?`,
    };
  }
  return {
    text: `Namaste Ramesh ji. I'm actively monitoring Annapurna Kirana:
• Today's counter sales: ₹18,420 (running 16% behind usual ₹21,900)
• Inactive customers: 240 accounts can generate ₹6,100 with a 10% blast
• Overdue credit: ₹2,800 across 5 customers needs a friendly nudge
• Low inventory: Parle biscuits at 0 stock before evening rush

Feel free to tap any suggestion or ask about sales, stock, or udhaar!`,
  };
}
