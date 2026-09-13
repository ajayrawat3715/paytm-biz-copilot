import { dailyCash, morningForecast, rupees } from "@/lib/khata";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  HelpCircle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

interface MorningBriefProps {
  collectedToday: number;
  totals?: {
    outstanding: number;
    udharCollectedToday: number;
    netDaily: number;
    cashSales: number;
    openCount: number;
    overdueAmount: number;
    overdueCount: number;
  };
  onOpenCampaign: () => void;
  onOpenInventory: () => void;
  onOpenUdhaar: () => void;
  onReviewAll: () => void;
  onExplain?: (title: string) => void;
}

export function MorningBrief({
  collectedToday,
  totals,
  onOpenCampaign,
  onOpenInventory,
  onOpenUdhaar,
  onReviewAll,
  onExplain,
}: MorningBriefProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const currentDayName = new Date().toLocaleDateString(
    isHindi ? "hi-IN" : "en-IN",
    {
      timeZone: "Asia/Kolkata",
      weekday: "long",
    },
  );

  const formattedDate = new Date().toLocaleDateString(
    isHindi ? "hi-IN" : "en-IN",
    {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "numeric",
      month: "long",
    },
  );

  const creditOutstanding = totals?.outstanding ?? 2950;
  const udhaarCollected = totals?.udharCollectedToday ?? 1360;
  const netDaily = totals?.netDaily ?? 18530;
  const openCount = totals?.openCount ?? 5;
  const overdueAmt = totals?.overdueAmount ?? 2800;

  return (
    <section className="mt-7 animate-settle">
      {/* Date & Copilot Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-rust">
          {formattedDate} · IST
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/80 px-2.5 py-0.5 text-[11px] font-semibold text-inksoft ring-1 ring-line">
          <Sparkles className="size-3 text-rust" />
          {isHindi ? "एआई प्रभात इनसाइट्स सक्रिय" : "AI Morning Intelligence Active"}
        </span>
      </div>

      {/* Hero Greeting & Business Status */}
      <h1 className="mt-3 text-balance font-sans text-[34px] sm:text-[42px] lg:text-[50px] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
        {t.morningGreeting}
      </h1>
      <p className="mt-1.5 text-balance font-sans text-[22px] sm:text-[30px] lg:text-[36px] font-semibold leading-[1.15] tracking-[-0.02em] text-inksoft">
        {t.quietSubtitle}
      </p>

      {/* 1. Core Financial KPIs Ribbon */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* KPI 1: Total Credit Outstanding */}
        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-inksoft">
            {isHindi ? "कुल बकाया उधार" : "Total Credit Outstanding"}
          </p>
          <p className="mt-1 font-sans text-[32px] sm:text-[38px] font-bold tabular-nums tracking-[-0.02em] text-ink">
            {rupees(creditOutstanding)}
          </p>
          <p className="mt-1 text-xs text-inksoft">
            {openCount} {isHindi ? "सक्रिय खाते" : "open accounts"} ·{" "}
            <span className="font-semibold text-rust">
              {rupees(overdueAmt)} {isHindi ? "अतिदेय" : "overdue"}
            </span>
          </p>
        </div>

        {/* KPI 2: Today's Udhaar Collection */}
        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-inksoft">
            {isHindi ? "आज की उधार वसूली" : "Today's Udhaar Collection"}
          </p>
          <p className="mt-1 font-sans text-[32px] sm:text-[38px] font-bold tabular-nums tracking-[-0.02em] text-emerald">
            {rupees(udhaarCollected)}
          </p>
          <p className="mt-1 text-xs text-inksoft">
            {isHindi ? "पेटीएम यूपीआई व नकद वसूली" : "Via Paytm UPI & counter cash"}
          </p>
        </div>

        {/* KPI 3: Net Daily Balance */}
        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-inksoft">
            {isHindi ? "दैनिक कुल बैलेंस" : "Net Daily Balance"}
          </p>
          <p className="mt-1 font-sans text-[32px] sm:text-[38px] font-bold tabular-nums tracking-[-0.02em] text-ink">
            {rupees(netDaily)}
          </p>
          <p className="mt-1 text-xs text-inksoft">
            {isHindi ? "बिक्री + वसूली - दैनिक खर्च" : "Counter sales + collections - expenses"}
          </p>
        </div>
      </div>

      {/* 2. ✦ Bharat AI Centerpiece Card */}
      <div className="mt-4 rounded-2xl bg-paper p-5 sm:p-6 ring-1 ring-rust/35 border-l-4 border-l-rust shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rust/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rust">
              <Sparkles className="size-3 text-rust" />
              {isHindi ? "✦ भारत अवलोकन" : "✦ BHARAT NOTICED"}
            </span>
            <span className="text-xs text-inksoft">
              {isHindi ? "दुकान पैटर्न विश्लेषण" : "Kirana pattern analysis"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-light/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald">
            <TrendingUp className="size-3" />
            {isHindi ? "उच्च प्रभाव अवसर" : "High Priority Action"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Observation, Drivers & Recommendation */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-ink leading-snug tracking-[-0.02em]">
                {isHindi
                  ? `${currentDayName} की बिक्री सामान्य से 16% कम रहने का अनुमान है।`
                  : `${currentDayName} sales are 16% below your usual.`}
              </h2>
            </div>

            {/* Why drivers */}
            <div className="rounded-xl bg-sand/40 p-3.5 ring-1 ring-line/70">
              <p className="text-xs font-bold uppercase tracking-wider text-ink">
                {isHindi ? "कारण क्या है? (WHY?)" : "WHY?"}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-inksoft">
                <li className="flex items-start gap-2">
                  <span className="size-1.5 mt-1.5 rounded-full bg-rust shrink-0" />
                  <span>
                    <strong className="text-ink font-semibold">240 {isHindi ? "ग्राहक" : "customers"}</strong>{" "}
                    {isHindi
                      ? "पिछले 15+ दिनों से दुकान पर नहीं आए हैं।"
                      : "haven't returned to your store in 15+ days."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 mt-1.5 rounded-full bg-rust shrink-0" />
                  <span>
                    <strong className="text-ink font-semibold">
                      {isHindi ? "शाम के लेन-देन में 22% की गिरावट" : "Evening transactions down 22%"}
                    </strong>{" "}
                    {isHindi ? "सामान्य औसत की तुलना में।" : "vs your typical baseline."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 mt-1.5 rounded-full bg-rust shrink-0" />
                  <span>
                    <strong className="text-ink font-semibold">
                      {isHindi ? "औसत बास्केट साइज ₹45 कम" : "Average basket size down ₹45"}
                    </strong>{" "}
                    {isHindi ? "दाल व सूखे किराना सामान में।" : "across dry grocery items."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Bharat Recommends */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rust">
                {isHindi ? "✦ भारत अनुशंसा" : "✦ BHARAT RECOMMENDS"}
              </p>
              <p className="mt-1 font-sans text-[15px] sm:text-[16px] font-semibold text-ink leading-snug">
                {isHindi
                  ? "42 निष्क्रिय ग्राहकों को आवश्यक किराना सामान पर 10% छूट का विशेष संदेश भेजें।"
                  : "Target 42 inactive customers with a 10% offer on essentials."}
              </p>
            </div>
          </div>

          {/* Right Column: Estimated Opportunity & Action CTAs */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-xl bg-sand/35 p-4 ring-1 ring-line">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-inksoft">
                {isHindi ? "अनुमानित अतिरिक्त अवसर" : "ESTIMATED OPPORTUNITY"}
              </p>
              <p className="mt-1 font-sans text-3xl sm:text-4xl font-bold tabular-nums tracking-[-0.02em] text-emerald">
                +₹6,100
              </p>
              <p className="mt-1 text-xs text-inksoft">
                {isHindi
                  ? "व्हाट्सएप अभियान से अपेक्षित अतिरिक्त बिक्री"
                  : "Expected counter pickup via WhatsApp offer"}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={onOpenCampaign}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rust py-2.5 px-4 text-xs font-semibold text-cream shadow-2xs hover:bg-rust/95 active:scale-[0.98] transition-all"
              >
                <span>{isHindi ? "कार्रवाई की समीक्षा करें" : "Review action"}</span>
                <ArrowRight className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onExplain
                    ? onExplain(
                        isHindi
                          ? "रविवार की बिक्री सामान्य से 16% कम"
                          : "Sunday sales are 16% below your usual",
                      )
                    : onOpenCampaign()
                }
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-paper py-2 px-3 text-xs font-semibold text-ink ring-1 ring-line hover:bg-sand/60 active:scale-[0.98] transition-all"
              >
                <HelpCircle className="size-3 text-inksoft" />
                <span>{isHindi ? "यह अनुशंसा क्यों?" : "Why this recommendation?"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Forecast & Run-rate Strip with 7-Day Trend */}
      <div className="mt-4 rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rust">
              <TrendingDown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.04em]">
                {t.forecastTitle}
              </span>
            </div>
            <p className="font-sans text-lg font-bold text-ink sm:text-xl leading-snug">
              {t.forecastText(currentDayName)}
            </p>
            <p className="text-xs text-inksoft leading-relaxed">
              {t.forecastSub(dailyCash.cashSales, morningForecast.usualSales)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-inksoft">{t.collectedSoFar}</p>
            <p className="mt-0.5 font-sans text-2xl sm:text-[32px] font-bold leading-none text-ink tabular-nums tracking-[-0.02em]">
              {rupees(collectedToday)}
            </p>
            <div
              className="mt-2.5 flex items-center justify-end gap-1"
              aria-label="last 8 days trend"
            >
              {dailyCash.last7.map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-2 rounded-t transition-all",
                    i === dailyCash.last7.length - 1 ? "bg-rust" : "bg-sand",
                  )}
                  style={{ height: `${h}px` }}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-inksoft">
              {t.last7Days} ·{" "}
              <span className="inline-flex items-center gap-1 font-medium text-emerald">
                <span className="size-1.5 animate-tick rounded-full bg-emerald" />
                live
              </span>
            </p>
          </div>
        </div>

        {/* 3 AI Generated Priorities with 01, 02, 03 Numbering */}
        <div className="mt-5 border-t border-line pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-rust text-[11px] font-bold text-cream">
                3
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink">
                {t.aiPrioritiesTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onReviewAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rust hover:underline transition-colors"
            >
              {t.reviewAll}
              <ArrowRight className="size-3" />
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Priority 01 - AI Opportunity (Terracotta Accent Card) */}
            <div className="flex flex-col justify-between rounded-2xl bg-rust-light/35 p-4 ring-1 ring-rust/35 transition-all hover:bg-rust-light/50">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rust/15 px-2.5 py-0.5 text-[11px] font-bold text-rust">
                    <span>01</span>
                    <span>·</span>
                    <span>{isHindi ? "वृद्धि" : "Growth"}</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald tabular-nums">
                    +₹6,100
                  </span>
                </div>
                <h3 className="mt-2.5 font-sans text-[15px] font-semibold leading-snug text-ink">
                  {t.p1Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-inksoft">
                  {t.p1Desc}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-ink">
                  {t.p1Impact}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCampaign}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rust py-2 text-xs font-semibold text-cream shadow-2xs transition-all hover:bg-rust/95 active:scale-[0.98]"
              >
                {t.p1Action}
                <ArrowRight className="size-3" />
              </button>
            </div>

            {/* Priority 02 - Stockout Risk (Amber Warning Card) */}
            <div className="flex flex-col justify-between rounded-2xl bg-paper p-4 ring-1 ring-line transition-all hover:border-warning/60 hover:bg-warning-light/20">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-light px-2.5 py-0.5 text-[11px] font-bold text-warning">
                    <span>02</span>
                    <span>·</span>
                    <span>{isHindi ? "स्टॉक" : "Stock"}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-warning">
                    {isHindi ? "नुकसान से बचें" : "Avoid loss"}
                  </span>
                </div>
                <h3 className="mt-2.5 font-sans text-[15px] font-semibold leading-snug text-ink">
                  {t.p2Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-inksoft">
                  {t.p2Desc}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-ink">
                  {t.p2Impact}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenInventory}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand py-2 text-xs font-semibold text-ink ring-1 ring-line transition-all hover:bg-paper active:scale-[0.98]"
              >
                {t.p2Action}
                <ArrowRight className="size-3" />
              </button>
            </div>

            {/* Priority 03 - Cash Recovery Card */}
            <div className="flex flex-col justify-between rounded-2xl bg-paper p-4 ring-1 ring-line transition-all hover:border-emerald/40 hover:bg-emerald-light/20">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-light px-2.5 py-0.5 text-[11px] font-bold text-emerald">
                    <span>03</span>
                    <span>·</span>
                    <span>{isHindi ? "वसूली" : "Recovery"}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald tabular-nums">
                    ₹2,800
                  </span>
                </div>
                <h3 className="mt-2.5 font-sans text-[15px] font-semibold leading-snug text-ink">
                  {t.p3Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-inksoft">
                  {t.p3Desc}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-ink">
                  {t.p3Impact}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUdhaar}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand py-2 text-xs font-semibold text-ink ring-1 ring-line transition-all hover:bg-paper active:scale-[0.98]"
              >
                {t.p3Action}
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

