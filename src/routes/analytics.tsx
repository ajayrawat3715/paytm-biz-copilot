import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeaderNav } from "@/components/HeaderNav";
import { useLanguage } from "@/lib/language-context";
import {
  hourlyTrafficData,
  settlementLog,
  shopInfo,
} from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Info,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Paytm Pulse — Bharat Kirana Analytics" },
      {
        name: "description",
        content:
          "Paytm UPI payment velocity, hourly footfall heatmaps, Soundbox settlements, and working capital advisory.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];
  const [activeHour, setActiveHour] = useState<string | null>("18:00");
  const [loanApplied, setLoanApplied] = useState(false);

  const maxHourlySales = Math.max(...hourlyTrafficData.map((d) => d.sales));
  const selectedHourData = hourlyTrafficData.find((d) => d.time === activeHour) || hourlyTrafficData[12];

  return (
    <div className="min-h-screen bg-cream text-ink pb-28 md:pb-16">
      <HeaderNav />

      <main className="mx-auto max-w-[1180px] px-4 sm:px-7 pt-6">
        {/* Page Hero Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-paytm/15 px-2.5 py-0.5 text-xs font-bold text-paytm">
                Paytm Pulse 4.0
              </span>
              <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-semibold text-emerald">
                {isHindi ? "● लाइव डेटा सिंक" : "● Live Data Stream"}
              </span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl font-bold text-ink sm:text-3xl">
              {t.pulseTitle}
            </h1>
            <p className="mt-1 text-sm text-inksoft">
              {t.pulseSub}
            </p>
          </div>

          <div className="rounded-xl bg-paper px-3.5 py-2 ring-1 ring-line text-xs font-medium text-inksoft flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald" />
            <span>{isHindi ? "पेटीएम साउंडबॉक्स आईडी: PB-4091" : "Paytm Soundbox ID: PB-4091"}</span>
          </div>
        </div>

        {/* 4 Core Vital Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "आज का कुल काउंटर" : "Total Collections Today"}
              </span>
              <span className="grid size-7 place-items-center rounded-lg bg-emerald/10 text-emerald">
                <Wallet className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">₹18,420</p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "126 यूपीआई + 42 नकद बिल" : "126 UPI + 42 cash transactions"}
            </p>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "पेटीएम साउंडबॉक्स/यूपीआई" : "Paytm Soundbox / UPI"}
              </span>
              <span className="grid size-7 place-items-center rounded-lg bg-paytm/15 text-paytm">
                <QrCode className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">₹12,840</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald">
              <ArrowUpRight className="size-3" />
              <span>{isHindi ? "कुल बिक्री का 69.7%" : "69.7% of counter volume"}</span>
            </div>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "औसत बिल (बास्केट साइज)" : "Average Ticket Size"}
              </span>
              <span className="grid size-7 place-items-center rounded-lg bg-sand text-ink">
                <TrendingUp className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">₹146</p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "शाम 6-8 बजे ₹192 तक बढ़ा" : "Peaked at ₹192 in evening rush"}
            </p>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "कार्यशील पूंजी कुशन" : "Working Capital Runway"}
              </span>
              <span className="grid size-7 place-items-center rounded-lg bg-rust/10 text-rust">
                <Banknote className="size-4" />
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">₹38,500</p>
            <p className="mt-1 text-[11px] text-emerald font-semibold">
              {isHindi ? "शुक्रवार का ₹22k सप्लायर बिल सुरक्षित" : "Covers ₹22k distributor dues"}
            </p>
          </div>
        </div>

        {/* Hourly Footfall Heatmap & Activity */}
        <section className="mt-6 rounded-[20px] bg-paper p-5 ring-1 ring-line sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {isHindi ? "घंटेवार ग्राहक भीड़ व बिक्री गतिविधि (Heatmap)" : "Hourly Traffic & Transaction Velocity"}
              </h2>
              <p className="text-xs text-inksoft">
                {isHindi
                  ? "किसी भी घंटे पर टैप करके उसकी बिक्री और भीड़ की स्थिति देखें"
                  : "Tap on any bar to inspect footfall, sales volume, and shop rush"}
              </p>
            </div>

            {/* Rush Legend */}
            <div className="flex items-center gap-3 text-xs text-inksoft">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-rust" /> {isHindi ? "शाम का मुख्य पीक" : "Evening Peak"}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-sand" /> {isHindi ? "सामान्य गतिविधि" : "Regular"}
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6">
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 sm:gap-2 items-end h-44 pb-2 border-b border-line">
              {hourlyTrafficData.map((item) => {
                const heightPct = Math.round((item.sales / maxHourlySales) * 100);
                const isSelected = item.time === activeHour;
                const isPeak = item.sales >= 2400;

                return (
                  <button
                    key={item.time}
                    type="button"
                    onClick={() => setActiveHour(item.time)}
                    className="group relative flex flex-col items-center justify-end h-full w-full focus:outline-none"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={cn(
                        "w-full rounded-t-md transition-all duration-300",
                        isSelected
                          ? "bg-rust shadow-md scale-105 ring-2 ring-rust/30"
                          : isPeak
                          ? "bg-rust/70 group-hover:bg-rust"
                          : "bg-sand group-hover:bg-sand/80"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {/* Time Labels */}
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 sm:gap-2 pt-2 text-[10px] text-inksoft text-center font-mono">
              {hourlyTrafficData.map((item) => (
                <span
                  key={item.time}
                  className={cn(
                    "truncate",
                    item.time === activeHour ? "font-bold text-rust" : ""
                  )}
                >
                  {item.time.slice(0, 2)}h
                </span>
              ))}
            </div>
          </div>

          {/* Selected Hour Insight Card */}
          {selectedHourData && (
            <div className="mt-4 rounded-xl bg-sand/40 p-4 ring-1 ring-line flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-rust text-cream font-mono font-bold text-xs">
                  {selectedHourData.time}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-ink">
                    {selectedHourData.label} ({selectedHourData.time})
                  </p>
                  <p className="text-xs text-inksoft">
                    {selectedHourData.txns} {isHindi ? "लेनदेन संपन्न" : "transactions completed"} · {isHindi ? "औसत टिकट" : "avg ticket"} ₹{Math.round(selectedHourData.sales / selectedHourData.txns)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display text-lg font-bold text-ink">
                  ₹{selectedHourData.sales.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-emerald font-semibold">
                  {selectedHourData.sales >= 2400 ? (isHindi ? "🔥 पीक समय" : "🔥 Peak Hour") : (isHindi ? "सामान्य गति" : "Normal Velocity")}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Split: Payment Ratio & Instant Settlement Log */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Payment Method Breakdown */}
          <section className="rounded-[20px] bg-paper p-5 ring-1 ring-line">
            <h2 className="font-display text-base font-bold text-ink">
              {isHindi ? "भुगतान माध्यम विभाजन" : "Payment Mode Breakdown"}
            </h2>
            <p className="text-xs text-inksoft">
              {isHindi ? "पेटीएम यूपीआई बनाम काउंटर पर भौतिक नकद" : "Paytm UPI vs Physical Cash settled at Annapurna Kirana"}
            </p>

            {/* Combined Bar */}
            <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-sand flex">
              <div className="h-full bg-paytm transition-all" style={{ width: "69.7%" }} />
              <div className="h-full bg-rust transition-all" style={{ width: "30.3%" }} />
            </div>

            <div className="mt-3 flex justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-paytm" />
                <span className="font-semibold text-ink">
                  {isHindi ? "पेटीएम यूपीआई / साउंडबॉक्स" : "Paytm UPI / Soundbox"}
                </span>
                <span className="text-inksoft font-mono">₹12,840 (69.7%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rust" />
                <span className="font-semibold text-ink">
                  {isHindi ? "भौतिक नकद" : "Cash"}
                </span>
                <span className="text-inksoft font-mono">₹5,580 (30.3%)</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-sand/30 p-3.5 text-xs text-inksoft ring-1 ring-line">
              <p className="font-semibold text-ink flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-rust" />
                {isHindi ? "भारत एआई अंतर्दृष्टि:" : "Bharat AI Insight:"}
              </p>
              <p className="mt-1">
                {isHindi
                  ? "70% ग्राहक अब सीधे पेटीएम साउंडबॉक्स पर ₹100 से कम के छोटे भुगतान डिजिटल कर रहे हैं, जिससे रोज़ाना छुट्टे सिक्कों (change) की समस्या 82% कम हो गई है।"
                  : "Micro-transactions under ₹100 are now 70% digital via Soundbox 4.0, reducing change currency shortages by 82% at your counter."}
              </p>
            </div>
          </section>

          {/* Paytm Soundbox Payouts */}
          <section className="rounded-[20px] bg-paper p-5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  {isHindi ? "साउंडबॉक्स ऑटो-सेटलमेंट बही" : "Soundbox Auto-Settlement Log"}
                </h2>
                <p className="text-xs text-inksoft">
                  {isHindi ? "सीधे आपके एचडीएफसी बैंक खाते में स्वतः जमा" : "Direct auto-sweep into your linked bank account"}
                </p>
              </div>
              <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald">
                {isHindi ? "तत्काल शून्य शुल्क" : "0% MDR · Free"}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {settlementLog.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl bg-sand/30 p-3 ring-1 ring-line/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-emerald/10 text-emerald">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink">{log.source}</p>
                      <p className="text-[11px] text-inksoft">
                        {log.bank} · {log.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-ink">{log.amount}</p>
                    <span className="text-[10px] text-emerald font-semibold">{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Paytm Merchant Capital / Loan Pre-Approval Banner */}
        <section className="mt-6 rounded-[22px] bg-gradient-to-r from-[#172033] via-[#1c2c47] to-[#00BAF2] p-5 sm:p-6 text-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Paytm Merchant Lending
                </span>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  {isHindi ? "पूर्व-स्वीकृत" : "Pre-Approved"}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl text-white">
                {isHindi
                  ? "₹1,50,000 का संपार्श्विक-मुक्त व्यापार ऋण उपलब्ध"
                  : "₹1,50,000 Collateral-Free Kirana Growth Loan Available"}
              </h3>
              <p className="mt-1 text-xs text-white/80 leading-relaxed">
                {isHindi
                  ? "अन्नपूर्णा किराना के पिछले 60 दिनों के पेटीएम यूपीआई लेन-देन (₹18,420/दिन) के आधार पर शून्य दस्तावेज़ीकरण के साथ तत्काल वितरण।"
                  : "Based on Annapurna Kirana's consistent ₹18k/day QR run-rate. Zero paperwork, auto-repaid at ₹250/day directly from morning Soundbox settlements."}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <p className="text-[11px] text-white/70">
                {isHindi ? "ब्याज दर: मात्र 1.2%/माह" : "Interest: 1.2%/month · Partner NBFC"}
              </p>
              <button
                type="button"
                onClick={() => setLoanApplied(!loanApplied)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#172033] shadow-sm hover:bg-white/90 active:scale-95 transition-all"
              >
                <Zap className="size-3.5 fill-[#00BAF2] text-[#00BAF2]" />
                <span>
                  {loanApplied
                    ? (isHindi ? "✓ आवेदन स्वीकृत (समीक्षाधीन)" : "✓ Application Dispatched")
                    : (isHindi ? "1-क्लिक में दावा करें" : "Claim ₹1.5L Loan in 1-Click")}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
