import { createFileRoute } from "@tanstack/react-router";

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
3. Structure: Keep responses crisp and structured (bullet points with bold key metrics like ₹ and percentages). Keep to 3-5 high-impact points.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey =
          process.env.GEMINI_API_KEY ||
          process.env.VITE_GEMINI_API_KEY ||
          process.env.LOVABLE_API_KEY;

        if (!apiKey) {
          return Response.json(
            { error: "GEMINI_API_KEY is not configured on server environment variables." },
            { status: 500 },
          );
        }

        try {
          const body = await request.json();
          const query =
            body.query ||
            (body.messages && body.messages[body.messages.length - 1]?.content) ||
            "";

          if (!query || typeof query !== "string") {
            return Response.json({ error: "Missing query in request body" }, { status: 400 });
          }

          const hasDevanagari = /[\u0900-\u097F]/.test(query);
          const lang = body.lang === "hi" || hasDevanagari ? "hi" : "en";
          const shopContext = body.shopContext || "";

          const userPrompt = `Merchant Preferred Language: ${lang === "hi" ? "Hindi (हिंदी)" : "English"}.
${shopContext ? `Current Screen Context: ${shopContext}\n` : ""}Merchant Query: ${query}

Remember: If language is Hindi, reply in pure, natural Devanagari Hindi. Address Ramesh ji respectfully. Provide practical numbers with ₹.`;

          const models = ["gemini-3.6-flash", "gemini-flash-latest"];
          for (const model of models) {
            try {
              const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
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
                },
              );

              if (res.ok) {
                const data = await res.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  return Response.json({ text });
                }
              }
            } catch {
              // try next model
            }
          }

          return Response.json(
            { error: "Failed to generate response from Gemini API models." },
            { status: 502 },
          );
        } catch (err: any) {
          return Response.json({ error: err.message || "Unknown server error" }, { status: 500 });
        }
      },
    },
  },
});
