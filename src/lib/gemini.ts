import { getCopilotResponse, type ChatResponse, type LanguageMode } from "./copilot-ai";

export function getGeminiApiKey(): string {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bharat_gemini_api_key");
      if (stored && stored.trim()) return stored.trim();
    }
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
  } catch {
    // fallback
  }
  return "";
}

export function setGeminiApiKey(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("bharat_gemini_api_key", key.trim());
    }
  } catch {
    // ignore
  }
}

export function getGeminiModel(): string {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_MODEL) {
      return import.meta.env.VITE_GEMINI_MODEL.trim();
    }
  } catch {
    // fallback
  }
  return "gemini-3.6-flash";
}

const STORE_SYSTEM_PROMPT = `You are Bharat (भारत), an expert AI Kirana Business Copilot built into the Paytm For Business Merchant app.
You are assisting Ramesh ji, owner of "Annapurna Kirana" located in Patna, Bihar.
You are powered directly by Google Gemini AI with real-time merchant ledger data.

Live Annapurna Kirana Store Snapshot:
• Today's Sales: ₹18,420 (Soundbox UPI: ₹12,840, Cash drawer: ₹5,580), 126 total transactions.
  (Normal Tuesday baseline is ₹21,900, so today is running ~16% slower).
• Udhaar / Khata (Credit): Total pending credit is ₹12,840. Currently ₹2,800 is overdue across 5 trusted customers:
  - Rajesh Kumar: ₹800 (8 days overdue)
  - Sunita Devi: ₹650 (12 days overdue)
  - Amit Verma: ₹500 (5 days overdue)
  - Manoj Singh: ₹450 (7 days overdue)
  - Vikram Patel: ₹400 (14 days overdue)
• Inactive / Lapsed Customers: 240 regular neighborhood customers haven't visited in 15+ days.
  Running a 10% Tuesday evening flash offer on WhatsApp can bring an estimated ₹6,100 in extra sales.
• Inventory Reorders (Urgent before evening rush):
  - Parle-G Biscuits (Gold 100g): Stock is 0. Expected evening demand is 12 units. Reorder 24 units from Sharma Distributors (wholesale cost: ₹480, saves ₹1,800 in lost sales).
  - Cold Drinks (250ml): 4 left (reorder 30).
  - Fresh Bread: 2 left (reorder 20).
• Profit & Loss: Net daily profit is +₹3,420 (18.6% net margin). Total expenses ₹14,200. Wastage/damage ₹800.
• Paytm Soundbox & UPI: 126 UPI transactions. UPI customers spend 18% more than cash customers (₹172 vs ₹146).

Guidelines:
1. Tone: Respectful, sharp, encouraging, and highly practical for an Indian retail shopkeeper.
   Address the merchant as "रमेश जी" in Hindi or "Ramesh ji" in English.
2. Language:
   - If language requested is 'hi' OR the user query contains Hindi / Devanagari script, respond ENTIRELY in clear, natural Devanagari Hindi (हिंदी).
   - If language is 'en', respond in concise, professional English.
   - If Hinglish is used, respond in friendly Devanagari Hindi or Hinglish matching the merchant's style.
3. Structure: Keep responses crisp and structured (bullet points with bold key metrics like ₹ and percentages). Keep to 3-5 high-impact points so it reads quickly on mobile counters.
4. Always prioritize actionable steps: e.g. reordering Parle biscuits before 5 PM, sending polite UPI payment links for ₹2,800 overdue credit, or launching the 10% flash discount.`;

function detectSuggestedAction(
  query: string,
  responseText: string,
  lang: LanguageMode,
): ChatResponse["suggestedAction"] | undefined {
  const combined = `${query} ${responseText}`.toLowerCase();
  const isHindi = lang === "hi" || /[\u0900-\u097F]/.test(responseText);

  // Check Inventory
  if (
    combined.includes("reorder") ||
    combined.includes("stock") ||
    combined.includes("parle") ||
    combined.includes("distributor") ||
    combined.includes("sharma") ||
    combined.includes("स्टॉक") ||
    combined.includes("रीस्टॉक") ||
    combined.includes("सामान") ||
    combined.includes("ऑर्डर") ||
    combined.includes("बिस्कुट")
  ) {
    return {
      type: "inventory",
      label: isHindi ? "शर्मा डिस्ट्रीब्यूटर्स का ऑर्डर भेजें" : "Review order with Sharma Dist.",
    };
  }

  // Check Campaign
  if (
    combined.includes("campaign") ||
    combined.includes("lapsed") ||
    combined.includes("inactive") ||
    combined.includes("offer") ||
    combined.includes("10%") ||
    combined.includes("240") ||
    combined.includes("अभियान") ||
    combined.includes("ऑफर") ||
    combined.includes("ग्राहक") ||
    combined.includes("छूट")
  ) {
    return {
      type: "campaign",
      label: isHindi ? "10% ऑफर अभियान देखें व भेजें" : "Review & launch campaign",
    };
  }

  // Check Udhaar
  if (
    combined.includes("udhaar") ||
    combined.includes("udhar") ||
    combined.includes("credit") ||
    combined.includes("remind") ||
    combined.includes("khata") ||
    combined.includes("overdue") ||
    combined.includes("bahi") ||
    combined.includes("उधार") ||
    combined.includes("खाता") ||
    combined.includes("वसूली") ||
    combined.includes("रिमाइंडर") ||
    combined.includes("बाकी")
  ) {
    return {
      type: "udhaar",
      label: isHindi ? "उधार रिमाइंडर देखें व भेजें" : "Review reminders",
    };
  }

  return undefined;
}

export interface AskGeminiParams {
  query: string;
  lang?: LanguageMode;
  shopContext?: string;
}

export async function askGeminiCopilot({
  query,
  lang = "en",
  shopContext,
}: AskGeminiParams): Promise<ChatResponse> {
  const q = query.trim();
  if (!q) {
    return getCopilotResponse(query, lang);
  }

  const apiKey = getGeminiApiKey();
  const model = getGeminiModel();

  if (!apiKey) {
    console.info("No Gemini API key detected, using local Kirana copilot.");
    return getCopilotResponse(q, effectiveLang);
  }

  // If Hindi script is present or lang is 'hi', ensure Hindi response
  const hasDevanagari = /[\u0900-\u097F]/.test(q);
  const effectiveLang: LanguageMode = hasDevanagari || lang === "hi" ? "hi" : "en";

  const userPrompt = `Merchant Preferred Language: ${effectiveLang === "hi" ? "Hindi (हिंदी)" : "English"}.
${shopContext ? `Current Screen Context: ${shopContext}\n` : ""}Merchant Query: ${q}

Remember: If language is Hindi, reply in pure, natural Devanagari Hindi. Address Ramesh ji respectfully. Provide practical numbers with ₹.`;

  const candidateModels = Array.from(new Set([model, "gemini-3.6-flash", "gemini-flash-latest"]));

  for (const m of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${STORE_SYSTEM_PROMPT}\n\n---\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 1000,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && typeof candidateText === "string") {
          const trimmedText = candidateText.trim();
          const suggestedAction = detectSuggestedAction(q, trimmedText, effectiveLang);

          return {
            text: trimmedText,
            suggestedAction,
          };
        }
      } else {
        console.warn(`Model ${m} returned HTTP ${res.status}, trying fallback model.`);
      }
    } catch (err) {
      console.warn(`Attempt with model ${m} failed:`, err);
    }
  }

  // All online models failed or timed out — seamlessly fallback to instant offline copilot
  console.info("Using local Kirana AI fallback engine.");
  return getCopilotResponse(q, effectiveLang);
}
