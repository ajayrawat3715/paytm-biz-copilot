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
    <section className="mt-4 animate-settle">
      {/* LUXURY BANKING HERO (Roohi Koohi Reference) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E121B] p-6 sm:p-8 lg:p-10 ring-1 ring-[#1F2637] shadow-2xl bg-blueprint-grid">
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-[#0D62FE]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-96 rounded-full bg-[#00BAF2]/10 blur-3xl" />

        {/* Brand status badge row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0D62FE]">
              BHARAT COPILOT
            </span>
            <span className="text-[#1F2637]">|</span>
            <span className="text-xs text-[#8E98AA]">
              {formattedDate} · IST
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#161C28] px-3 py-1 text-[11px] font-semibold text-[#8E98AA] ring-1 ring-[#1F2637]">
            <span className="size-1.5 rounded-full bg-[#10B981] animate-tick" />
            {isHindi ? "पेटीएम एआई लाइव" : "Paytm AI Engine Live"}
          </span>
        </div>

        {/* 2-Column Main Hero Section */}
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline & Stacked 3D Cards Visual */}
          <div className="lg:col-span-7">
            {/* The Signature Headline with Instrument Serif Italic */}
            <h1 className="font-sans text-[36px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              {isHindi ? (
                <>
                  स्मार्ट किराना <br />
                  सच्ची <span className="font-editorial text-[1.18em] font-normal tracking-normal text-white">आर्थिक</span>{" "}
                  <span className="font-editorial text-[1.18em] font-normal tracking-normal text-white">स्वतंत्रता</span>{" "}
                  के लिए
                </>
              ) : (
                <>
                  Intelligent Kirana <br />
                  for True <span className="font-editorial text-[1.18em] font-normal tracking-normal text-white">Financial</span> <br />
                  <span className="font-editorial text-[1.18em] font-normal tracking-normal text-white">Freedom</span>
                </>
              )}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#8E98AA] leading-relaxed max-w-md">
              {isHindi
                ? "सुप्रभात, रमेश जी। अन्नपूर्णा किराना स्टोर के लिए दैनिक बिक्री, उधार वसूली और स्टॉक इनसाइट्स सक्रिय हैं।"
                : "Good morning, Ramesh. Annapurna Kirana is live with daily credit recovery, Paytm UPI pulse, and predictive stock AI."}
            </p>

            {/* The Stacked 3D Payment Cards Visual with Circular Star Badge */}
            <div className="relative mt-8 h-48 sm:h-52 w-full max-w-[420px]">
              {/* Card 1 (Yellow / Gold, angled back left, like Yurnero) */}
              <div className="absolute left-0 bottom-2 h-36 w-28 sm:w-32 rounded-2xl bg-[#F59E0B] p-3 text-[#0A0D14] shadow-xl rotate-[-14deg] transition-transform hover:rotate-[-10deg] cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Khata</span>
                  <Wallet className="size-3.5" />
                </div>
                <div className="mt-7">
                  <p className="text-[9px] font-semibold opacity-80">UDHAAR</p>
                  <p className="font-sans text-xs font-bold tabular-nums">₹2,950</p>
                </div>
                <p className="mt-2 text-[9px] font-bold">Ramesh Kirana</p>
              </div>

              {/* Card 2 (Crisp Pure White, angled middle, like Arya Hima) */}
              <div className="absolute left-16 sm:left-20 bottom-1 h-38 w-30 sm:w-34 rounded-2xl bg-white p-3 text-[#0A0D14] shadow-xl rotate-[-4deg] transition-transform hover:rotate-0 cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Soundbox</span>
                  <Sparkles className="size-3.5 text-[#0D62FE]" />
                </div>
                <div className="mt-8">
                  <p className="text-[9px] font-semibold text-gray-500">PAYTM UPI</p>
                  <p className="font-sans text-xs font-bold tabular-nums">Instant Chime</p>
                </div>
                <p className="mt-2 text-[9px] font-bold">Annapurna Store</p>
              </div>

              {/* Card 3 (Cobalt Blue, front and prominent, like Standcard) */}
              <div className="absolute left-32 sm:left-40 bottom-0 h-44 w-52 sm:w-60 rounded-2xl bg-gradient-to-br from-[#0D62FE] to-[#0047CC] p-4 text-white shadow-2xl ring-1 ring-white/20 rotate-[6deg] transition-transform hover:rotate-[3deg] cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-black tracking-wider uppercase">Standcard</span>
                  <div className="flex items-center gap-1 text-[10px] font-semibold opacity-90">
                    <span>Paytm</span>
                    <span className="size-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {/* Micro Chip graphic */}
                  <div className="h-5 w-6 rounded-sm bg-[#F59E0B]/80 border border-yellow-200/50" />
                  <span className="text-[9px] tracking-widest text-white/70">•••)))</span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-xs tracking-widest font-bold text-white">
                      •••• 2568
                    </p>
                    <p className="mt-1 font-sans text-[11px] font-medium text-white/90">
                      Ramesh Kumar
                    </p>
                  </div>
                  <p className="font-mono text-[10px] text-white/80">05/28</p>
                </div>
              </div>

              {/* Circular Star Badge (Directly like Roohi Koohi's badge) */}
              <div className="absolute right-0 sm:-right-4 top-2 flex size-18 sm:size-20 items-center justify-center rounded-full border border-dashed border-[#8E98AA]/40 bg-[#121620]/90 backdrop-blur-md shadow-lg">
                <div className="text-center">
                  <Sparkles className="mx-auto size-4 text-[#0D62FE] animate-pulse" />
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-[#8E98AA] mt-0.5">
                    BHARAT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key High-Trust Metrics & Solid Cobalt CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#121620]/90 p-6 sm:p-7 ring-1 ring-[#1F2637] backdrop-blur-md">
            <div className="space-y-6">
              {/* Metric 1: Satisfied Customers / Kirana Footfall */}
              <div>
                <p className="font-sans text-4xl sm:text-5xl font-bold tabular-nums tracking-[-0.03em] text-white">
                  9.8<span className="text-2xl sm:text-3xl text-[#0D62FE]">k</span>
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#8E98AA]">
                  {isHindi ? "मासिक संतुष्ट ग्राहक आवागमन" : "Satisfied Customers / Footfall"}
                </p>
              </div>

              {/* Metric 2: 0% Admin Fee */}
              <div className="border-t border-[#1F2637] pt-5">
                <p className="font-sans text-4xl sm:text-5xl font-bold tabular-nums tracking-[-0.03em] text-white">
                  0<span className="text-2xl sm:text-3xl text-[#0D62FE]">%</span>
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#8E98AA]">
                  {isHindi ? "शून्य यूपीआई अतिरिक्त शुल्क" : "Admin Fee on Counter UPI"}
                </p>
              </div>

              {/* Mission statement text */}
              <div className="border-t border-[#1F2637] pt-5">
                <p className="text-xs sm:text-sm text-[#8E98AA] leading-relaxed">
                  {isHindi
                    ? "खुला, ईमानदार, मेहनती। भारतीय दुकानदारों को सशक्त बनाना — एक समय में एक डिजिटल लेन-देन।"
                    : "Open. Honest. Hardworking. Changing Kirana lives — one member at a time."}
                </p>
              </div>
            </div>

            {/* The Solid Electric Cobalt CTA Button (Just like "Get Started") */}
            <button
              type="button"
              onClick={onReviewAll}
              className="btn-cobalt mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-semibold tracking-wide text-white cursor-pointer"
            >
              <span>{isHindi ? "आज की कार्रवाई शुरू करें" : "Get Started"}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Trusted By Strip (Roohi Koohi Reference) */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#1F2637] pt-5 text-xs text-[#8E98AA]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">
              {isHindi ? "12,000+ भारतीय किराना स्टोर्स द्वारा भरोसेमंद" : "Trusted by 12,000+ Kirana Stores"}
            </span>
            <span className="text-[#1F2637]">·</span>
            <span>{isHindi ? "पेटीएम साउंडबॉक्स व यूपीआई पावर्ड" : "Powered by Paytm Soundbox & UPI"}</span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[11px] font-bold tracking-widest text-[#8E98AA]/70 uppercase">
            <span>Paytm</span>
            <span>UPI</span>
            <span>RuPay</span>
            <span>NPCI</span>
          </div>
        </div>
      </div>

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

