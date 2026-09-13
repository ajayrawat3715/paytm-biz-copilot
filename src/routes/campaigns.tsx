import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeaderNav } from "@/components/HeaderNav";
import { useLanguage } from "@/lib/language-context";
import { campaignRecipes } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  Percent,
  Play,
  Send,
  Sliders,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "AI Campaign & Growth Studio — Bharat Kirana Copilot" },
      {
        name: "description",
        content:
          "Interactive What-If promotion simulation sandbox, margin protection advisory, and 1-click WhatsApp broadcast generator.",
      },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  // Interactive What-If Simulator State
  const [selectedDiscount, setSelectedDiscount] = useState<number>(10);
  const [selectedRecipe, setSelectedRecipe] = useState(campaignRecipes[0]);
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});

  const discountScenarios: Record<
    number,
    { customers: number; revenue: number; profit: number; noteEn: string; noteHi: string; isBest: boolean }
  > = {
    5: {
      customers: 22,
      revenue: 4100,
      profit: 1800,
      noteEn: "Safe margin, but modest footfall response on quiet days.",
      noteHi: "मार्जिन सुरक्षित, परंतु मंदे दिनों में ग्राहकों की संख्या सीमित।",
      isBest: false,
    },
    10: {
      customers: 38,
      revenue: 6100,
      profit: 2100,
      noteEn: "⭐ Sweet spot: optimal footfall without sacrificing gross margin.",
      noteHi: "⭐ सर्वोत्तम विकल्प: बिना मार्जिन खोए सबसे अधिक शुद्ध लाभ।",
      isBest: true,
    },
    15: {
      customers: 51,
      revenue: 7200,
      profit: 1750,
      noteEn: "Brings 13 more customers, but profit drops by ₹350 due to deeper cuts.",
      noteHi: "13 अधिक ग्राहक आएंगे, लेकिन अत्यधिक छूट से लाभ ₹350 घट जाएगा।",
      isBest: false,
    },
    20: {
      customers: 64,
      revenue: 7900,
      profit: 1200,
      noteEn: "⚠️ High turnover but margin erosion hurts Kirana working capital.",
      noteHi: "⚠️ बिक्री बढ़ेगी लेकिन मार्जिन बहुत कम होने से नुकसान संभव।",
      isBest: false,
    },
  };

  const currentScenario = discountScenarios[selectedDiscount];

  const handleDispatch = (id: string) => {
    setDispatchedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-cream text-ink bg-blueprint-grid pb-28 md:pb-16">
      <HeaderNav />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-7 pt-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rust-light px-2.5 py-1 text-xs font-medium text-rust">
                {isHindi ? "एआई ऑफर व विकास स्टूडियो" : "AI Growth Studio"}
              </span>
              <span className="rounded-full bg-emerald-light px-2.5 py-1 text-xs font-medium text-emerald">
                {isHindi ? "मार्जिन सुरक्षा सक्रिय" : "Gross Margin Guard Active"}
              </span>
            </div>
            <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-ink">
              {t.campaignPageTitle}
            </h1>
            <p className="mt-1 text-sm text-inksoft">
              {t.campaignPageSub}
            </p>
          </div>

          <div className="rounded-xl bg-paper px-3.5 py-2 ring-1 ring-line text-xs font-medium text-ink flex items-center gap-2 shadow-2xs">
            <Sparkles className="size-4 text-rust" />
            <span className="tabular-nums font-semibold">{isHindi ? "अनुमानित अतिरिक्त लाभ: +₹2,100" : "Predicted Net Lift: +₹2,100"}</span>
          </div>
        </div>

        {/* Section 1: Interactive What-If Simulation Sandbox */}
        <section className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-rust" />
                <h2 className="font-sans text-[20px] sm:text-[22px] font-bold text-ink leading-[1.2] tracking-[-0.02em]">
                  {isHindi ? "एआई 'व्हाट-इफ़' (What-If) डिस्काउंट सैंडबॉक्स" : "Interactive 'What-If' Discount Simulator"}
                </h2>
              </div>
              <p className="text-xs text-inksoft mt-0.5">
                {isHindi
                  ? "विभिन्न छूट प्रतिशत का परीक्षण करें और देखें कि दुकान के शुद्ध लाभ पर क्या प्रभाव पड़ता है"
                  : "Test 5% to 20% discount tiers to balance customer footfall against net cash profit"}
              </p>
            </div>

            {/* Discount Selector Pills */}
            <div className="flex items-center gap-1.5 rounded-xl bg-sand/50 p-1 ring-1 ring-line">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setSelectedDiscount(pct)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    selectedDiscount === pct
                      ? "bg-rust text-white shadow-2xs font-semibold"
                      : "text-inksoft hover:text-ink hover:bg-paper"
                  )}
                >
                  {pct}% {pct === 10 ? "⭐" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Comparison Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-cream/70 p-4 ring-1 ring-line/80">
              <span className="text-xs text-inksoft flex items-center justify-between">
                <span>{isHindi ? "अनुमानित लौटने वाले ग्राहक" : "Expected Returning Customers"}</span>
                <Users className="size-3.5 text-inksoft" />
              </span>
              <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold tabular-nums tracking-[-0.02em] text-ink">
                {currentScenario.customers} {isHindi ? "ग्राहक" : "footfalls"}
              </p>
              <p className="mt-1 text-[11px] text-inksoft">
                {isHindi ? "240 सुप्त ग्राहकों में से" : "Out of 240 inactive cohort"}
              </p>
            </div>

            <div className="rounded-xl bg-cream/70 p-4 ring-1 ring-line/80">
              <span className="text-xs text-inksoft flex items-center justify-between">
                <span>{isHindi ? "अनुमानित कुल बिक्री (Gross)" : "Projected Gross Revenue"}</span>
                <TrendingUp className="size-3.5 text-inksoft" />
              </span>
              <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold tabular-nums tracking-[-0.02em] text-ink">
                ₹{currentScenario.revenue.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] text-inksoft">
                {isHindi ? "शाम 4 से 8 बजे के बीच" : "During 4 PM – 8 PM window"}
              </p>
            </div>

            <div className="rounded-xl bg-cream/70 p-4 ring-1 ring-line/80 border-l-[3px] border-l-emerald">
              <span className="text-xs text-inksoft flex items-center justify-between">
                <span>{isHindi ? "अनुमानित शुद्ध लाभ (Net Profit)" : "Estimated Net Profit"}</span>
                <Sparkles className="size-3.5 text-emerald" />
              </span>
              <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold tabular-nums tracking-[-0.02em] text-emerald">
                ₹{currentScenario.profit.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-emerald">
                {currentScenario.isBest
                  ? (isHindi ? "⭐ अधिकतम मुनाफा स्तर" : "⭐ Peak Profitability")
                  : (isHindi ? "कम मार्जिन दक्षता" : "Sub-optimal Margin")}
              </p>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="mt-4 rounded-xl bg-rust-light/35 p-4 ring-1 ring-rust/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 max-w-2xl">
              <span className="grid size-6 place-items-center rounded-full bg-rust text-white font-sans text-xs shrink-0 mt-0.5 font-semibold">
                भ
              </span>
              <div>
                <p className="font-semibold text-xs text-ink">
                  {isHindi ? "भारत एआई विश्लेषण:" : "Bharat AI Recommendation:"}
                </p>
                <p className="mt-0.5 text-xs text-inksoft leading-relaxed">
                  {isHindi ? currentScenario.noteHi : currentScenario.noteEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDiscount(10)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-medium transition-all shadow-2xs",
                selectedDiscount === 10
                  ? "bg-emerald text-white font-semibold"
                  : "bg-paper text-ink hover:bg-sand/60 ring-1 ring-line"
              )}
            >
              {selectedDiscount === 10
                ? (isHindi ? "✓ 10% अनुशंसित चुना गया" : "✓ 10% Optimal Selected")
                : (isHindi ? "10% सर्वोत्तम चुनें" : "Reset to 10%")}
            </button>
          </div>
        </section>

        {/* Section 2: Ready-to-Deploy Campaign Recipes */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-semibold text-ink">
                {isHindi ? "तैयार किराना अभियान रेसिपी" : "Pre-Built Kirana Promotional Recipes"}
              </h2>
              <p className="text-xs text-inksoft mt-0.5">
                {isHindi
                  ? "भारतीय किराना दुकानों के लिए विशेष रूप से डिज़ाइन किए गए त्वरित अभियान"
                  : "Field-tested high-conversion triggers for Patna neighborhood stores"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {campaignRecipes.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              const isSent = dispatchedMap[recipe.id];

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={cn(
                    "cursor-pointer rounded-2xl bg-paper p-5 ring-1 transition-all shadow-2xs flex flex-col justify-between",
                    isSelected ? "ring-2 ring-rust bg-rust-light/15" : "ring-line hover:bg-sand/15"
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-rust-light px-2.5 py-0.5 text-[11px] font-medium text-rust">
                        {recipe.profitTag}
                      </span>
                      <Clock className="size-3.5 text-inksoft" />
                    </div>

                    <h3 className="mt-2 font-sans text-base font-semibold text-ink">{recipe.title}</h3>
                    <p className="mt-1 text-xs text-inksoft">{recipe.targetAudience}</p>

                    <div className="mt-3 space-y-1.5 rounded-xl bg-cream/70 p-3 text-xs ring-1 ring-line/60">
                      <p className="text-[11px] text-inksoft">
                        <strong className="text-ink">{isHindi ? "छूट पेशकश:" : "Offer:"}</strong> {recipe.discount}
                      </p>
                      <p className="text-[11px] text-inksoft">
                        <strong className="text-ink">{isHindi ? "समय सीमा:" : "Window:"}</strong> {recipe.timing}
                      </p>
                      <p className="text-[11px] text-emerald font-semibold tabular-nums">
                        {isHindi ? "अनुमानित लाभ:" : "Net Lift:"} {recipe.expectedProfit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                    <span className="text-[11px] font-medium text-inksoft">
                      {isSelected ? (isHindi ? "✓ पूर्वावलोकन चयनित" : "✓ Active Preview") : (isHindi ? "क्लिक करें" : "Click to view")}
                    </span>

                    {isSent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald">
                        <CheckCircle2 className="size-3.5" />
                        <span>{isHindi ? "ब्रॉडकास्ट भेजा" : "Scheduled"}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDispatch(recipe.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rust px-3 py-1.5 text-xs font-medium text-white hover:bg-rust/90 active:scale-95 shadow-2xs"
                      >
                        <Send className="size-3" />
                        <span>{isHindi ? "शुरू करें" : "Launch"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: WhatsApp Broadcast Studio Preview */}
        {selectedRecipe && (
          <section className="mt-8 rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold text-ink">
                    {isHindi ? "व्हाट्सएप ब्रॉडकास्ट संदेश पूर्वावलोकन" : "WhatsApp Broadcast Copy Preview"}
                  </h3>
                  <p className="text-xs text-inksoft">
                    {isHindi ? "लक्षित दर्शकों के लिए तैयार संदेश" : `Targeting: ${selectedRecipe.targetAudience}`}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink ring-1 ring-line">
                Paytm UPI Deep Link
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3 items-center">
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-[#DCF8C6]/25 p-4 text-xs font-sans text-ink ring-1 ring-[#25D366]/30 shadow-2xs leading-relaxed">
                  <p className="font-semibold text-[#075E54]">Annapurna Kirana — Exclusive Offer</p>
                  <p className="mt-1.5">{selectedRecipe.whatsappTemplate}</p>
                  <p className="mt-2 text-[10px] text-inksoft font-mono">
                    ⚡ Instant UPI: upi://pay?pa=annapurna.kirana@paytm&pn=Annapurna+Kirana
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-cream/70 p-4 ring-1 ring-line text-xs space-y-2">
                <p className="font-semibold text-ink">{isHindi ? "प्रसारण विवरण:" : "Broadcast Specs:"}</p>
                <p className="text-inksoft">
                  • <strong>{isHindi ? "प्राप्तकर्ता:" : "Recipients:"}</strong> {selectedRecipe.targetAudience}
                </p>
                <p className="text-inksoft">
                  • <strong>{isHindi ? "डिलीवरी समय:" : "Delivery Time:"}</strong> {selectedRecipe.timing}
                </p>
                <p className="text-inksoft">
                  • <strong>{isHindi ? "वितरण चैनल:" : "Channel:"}</strong> WhatsApp Business API + Paytm QR
                </p>

                <button
                  type="button"
                  onClick={() => handleDispatch(selectedRecipe.id)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-medium text-white shadow-2xs hover:bg-[#20bd5a] active:scale-95 transition-all"
                >
                  <Send className="size-3.5" />
                  <span>
                    {dispatchedMap[selectedRecipe.id]
                      ? (isHindi ? "✓ प्रसारण अनुसूचित" : "✓ Campaign Dispatched")
                      : (isHindi ? "व्हाट्सएप ब्रॉडकास्ट जारी करें" : "Launch WhatsApp Broadcast")}
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
