import { useLanguage } from "@/lib/language-context";
import { paytmInsightsData } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  Info,
  QrCode,
  Sparkles,
} from "lucide-react";

interface PaytmInsightsProps {
  onTriggerCampaign?: () => void;
}

const HINDI_INSIGHTS = [
  {
    id: "upi-spend",
    title: "यूपीआई पर बड़ा बिल साइज",
    text: "आपके यूपीआई ग्राहक नकद ग्राहकों की तुलना में प्रति विजिट लगभग 18% अधिक खर्च करते हैं।",
    metric: "₹172 औसत यूपीआई बनाम ₹146 समग्र औसत",
    action: "बिलिंग काउंटर पर पेटीएम क्यूआर को प्रमुखता से रखें",
  },
  {
    id: "lapsed-regulars",
    title: "नियमित बड़े ग्राहक अनुपस्थित",
    text: "7 नियमित ग्राहक जो आमतौर पर ₹300+ खर्च करते हैं, पिछले 10 दिनों से नहीं आए हैं।",
    metric: "₹2,100+ साप्ताहिक बिक्री जोखिम में",
    action: "वीआईपी व्हाट्सएप चेक-इन संदेश भेजें",
  },
  {
    id: "evening-peak",
    title: "शनिवार शाम की मुख्य बिक्री",
    text: "शनिवार की शाम आपके पूरे हफ्ते के राजस्व का 34% हिस्सा बनाती है।",
    metric: "शाम का पीक समय: 5:30 PM – 9:00 PM",
    action: "काउंटर स्टाफ और स्टॉक तैयार रखें",
  },
];

export function PaytmInsights({ onTriggerCampaign }: PaytmInsightsProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const maxWeekly = Math.max(
    ...paytmInsightsData.weeklySales.map((d) => d.total),
  );

  const insightsList = isHindi ? HINDI_INSIGHTS : paytmInsightsData.aiInsights;

  return (
    <section className="mt-8 animate-settle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="grid size-6 place-items-center rounded-lg bg-[#00BAF2] text-white shadow-2xs">
            <QrCode className="size-3.5" />
          </div>
          <h2 className="font-sans text-[22px] sm:text-[24px] font-bold text-ink leading-[1.2] tracking-[-0.02em]">
            {t.paytmInsightsTitle}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-medium text-inksoft ring-1 ring-line">
          <Info className="size-3 text-[#00BAF2]" />
          {t.paytmDemoBadge}
        </span>
      </div>

      {/* 5 Core Metric Tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.todayPayments}</p>
          <p className="mt-1 font-sans text-2xl font-bold text-ink sm:text-[26px] tabular-nums tracking-[-0.02em]">
            ₹{paytmInsightsData.todayPayments.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[11px] text-inksoft">{t.todayPaymentsSub}</p>
        </div>

        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.upiTxns}</p>
          <p className="mt-1 font-sans text-2xl font-bold text-ink sm:text-[26px] tabular-nums tracking-[-0.02em]">
            {paytmInsightsData.upiTransactions}
          </p>
          <p className="mt-1 text-[11px] text-emerald font-medium">{t.upiTxnsSub}</p>
        </div>

        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.avgTxn}</p>
          <p className="mt-1 font-sans text-2xl font-bold text-ink sm:text-[26px] tabular-nums tracking-[-0.02em]">
            ₹{paytmInsightsData.averageTransaction}
          </p>
          <p className="mt-1 text-[11px] text-inksoft">{t.avgTxnSub}</p>
        </div>

        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.repeatCust}</p>
          <p className="mt-1 font-sans text-2xl font-bold text-ink sm:text-[26px] tabular-nums tracking-[-0.02em]">
            {paytmInsightsData.repeatCustomers}%
          </p>
          <p className="mt-1 text-[11px] text-inksoft">{t.repeatCustSub}</p>
        </div>

        <div className="col-span-2 rounded-2xl bg-paper p-4 ring-1 ring-line sm:col-span-1 shadow-2xs">
          <p className="text-xs text-inksoft">{t.upiRev}</p>
          <p className="mt-1 font-sans text-2xl font-bold text-emerald sm:text-[26px] tabular-nums tracking-[-0.02em]">
            ₹{paytmInsightsData.upiRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[11px] text-inksoft">{t.upiRevSub}</p>
        </div>
      </div>

      {/* 7-Day Payment Trend Chart */}
      <div className="mt-4 rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-sans text-base font-semibold text-ink">
              {t.trendTitle}
            </h3>
            <p className="text-xs text-inksoft">{t.trendSub}</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#00BAF2]" />
              {isHindi ? "पेटीएम यूपीआई" : "Paytm UPI"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-sand" />
              {isHindi ? "नकद" : "Cash"}
            </span>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="mt-6 flex items-end justify-between gap-2 pt-4 sm:gap-4">
          {paytmInsightsData.weeklySales.map((item) => {
            const upiHeight = Math.round((item.upi / maxWeekly) * 110);
            const cashHeight = Math.round((item.cash / maxWeekly) * 110);
            const isToday = item.day === "Sat";

            return (
              <div
                key={item.day}
                className="group flex flex-1 flex-col items-center gap-1.5"
              >
                <div className="relative flex w-full max-w-[42px] flex-col items-center justify-end rounded-t-lg bg-cream/40 p-0.5">
                  <div className="pointer-events-none absolute -top-12 z-10 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[10px] text-cream opacity-0 shadow-sm transition-opacity group-hover:block group-hover:opacity-100">
                    <p className="font-semibold tabular-nums">
                      ₹{item.total.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[9px] opacity-80 tabular-nums">
                      UPI: ₹{item.upi.toLocaleString("en-IN")} | Cash: ₹
                      {item.cash.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className="w-full rounded-t-xs bg-sand transition-all"
                    style={{ height: `${cashHeight}px` }}
                  />
                  <span
                    className={cn(
                      "w-full rounded-t-xs transition-all",
                      isToday ? "bg-rust" : "bg-[#00BAF2]",
                    )}
                    style={{ height: `${upiHeight}px` }}
                  />
                </div>

                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isToday ? "text-rust" : "text-ink",
                    )}
                  >
                    {isHindi && item.day === "Sat"
                      ? "आज (शनि)"
                      : isHindi && item.day === "Sun"
                      ? "अनुमान"
                      : item.day}
                  </p>
                  <p className="text-[10px] text-inksoft">{item.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bharat AI Generated Insights Strip */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {insightsList.map((insight, idx) => (
          <div
            key={insight.id}
            className="flex flex-col justify-between rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-1.5 text-rust">
                <Sparkles className="size-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  {isHindi ? `एआई इनसाइट #${idx + 1}` : `AI Insight #${idx + 1}`}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-ink leading-snug">
                "{insight.text}"
              </p>
              <p className="mt-1.5 text-[11px] text-inksoft leading-relaxed">
                {insight.metric}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-line/60">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rust">
                {isHindi ? "कार्रवाई:" : "Action:"} {insight.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
