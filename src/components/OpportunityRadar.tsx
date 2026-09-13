import { useKiranaData } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { opportunityRadarData, type OpportunityRadarItem } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Package,
  Radar,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

interface OpportunityRadarProps {
  onOpenCampaign: () => void;
  onOpenInventory: () => void;
  onOpenUdhaar: () => void;
  onExplain?: (title: string) => void;
}

const HINDI_RADAR_ITEMS: Record<
  string,
  {
    title: string;
    desc: string;
    reason: string;
    recommendedAction: string;
    buttonText: string;
    badge: string;
  }
> = {
  "radar-inactive": {
    title: "निष्क्रिय ग्राहकों को वापस लाएं",
    desc: "240 ग्राहक हाल ही में दुकान पर नहीं आए हैं।",
    reason: "मंगलवार की ग्राहक गतिविधि सामान्य से 21% कम है।",
    recommendedAction: "10% लक्षित शाम का ऑफर जारी करें।",
    buttonText: "अवसर देखें",
    badge: "राजस्व वृद्धि",
  },
  "radar-stock": {
    title: "स्टॉक नुकसान से बचाव",
    desc: "पारले बिस्कुट वर्तमान में स्टॉक से बाहर है।",
    reason: "स्टॉक 0 है और शाम की चाय की भीड़ में 12 पैकेट की मांग रहती है।",
    recommendedAction: "अनुशंसित पुनःऑर्डर: 24 पैकेट।",
    buttonText: "ऑर्डर देखें",
    badge: "स्टॉक सुरक्षा",
  },
  "radar-udhaar": {
    title: "उधार की वसूली",
    desc: "5 ग्राहकों पर ₹2,800 का उधार बकाया है।",
    reason: "5 नियमित ग्राहक तय तारीख से 5-14 दिन लेट हैं।",
    recommendedAction: "विनम्र व्हाट्सएप भुगतान रिमाइंडर भेजें।",
    buttonText: "रिमाइंडर देखें",
    badge: "नकद वसूली",
  },
};

export function OpportunityRadar({
  onOpenCampaign,
  onOpenInventory,
  onOpenUdhaar,
  onExplain,
}: OpportunityRadarProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];
  const { inventory, totals, activeCampaigns } = useKiranaData();

  const parleItem = inventory.find((i) => i.id === "inv-1");
  const isParleRestocked = parleItem ? parleItem.stock > 0 : false;
  const isCampaignActive = !!activeCampaigns["lapsed-10"] || !!activeCampaigns["tuesday-flash"];
  const overdueAmt = totals.overdueAmount;
  const isUdhaarRecovered = overdueAmt === 0;

  const dynamicTotalOpportunity =
    (isCampaignActive ? 0 : 6100) +
    (isParleRestocked ? 0 : totals.estimatedStockLoss || 1800) +
    overdueAmt;

  const activeCount =
    (isCampaignActive ? 0 : 1) +
    (isParleRestocked ? 0 : 1) +
    (isUdhaarRecovered ? 0 : 1);

  const handleAction = (type: "campaign" | "inventory" | "udhaar") => {
    if (type === "campaign") onOpenCampaign();
    else if (type === "inventory") onOpenInventory();
    else if (type === "udhaar") onOpenUdhaar();
  };

  return (
    <section id="opportunity-radar-section" className="mt-8 animate-settle">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-rust/10 text-rust">
              <Radar className="size-3.5 animate-pulse" />
            </span>
            <h2 className="font-sans text-[22px] sm:text-[24px] font-bold text-ink leading-[1.2] tracking-[-0.02em]">
              {t.radarTitle}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-inksoft">{t.radarSub}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            activeCount === 0
              ? "bg-emerald-light text-emerald"
              : "bg-emerald-light text-emerald"
          )}
        >
          <Sparkles className="size-3" />
          {activeCount === 0
            ? isHindi
              ? "सभी अवसर संपन्न ✨"
              : "All Opportunities Resolved ✨"
            : isHindi
            ? `${activeCount} नए अवसर सक्रिय`
            : `${activeCount} Live Opportunities`}
        </span>
      </div>

      {/* 3 Opportunity Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {opportunityRadarData.items.map((item) => {
          const hi = HINDI_RADAR_ITEMS[item.id];
          let title = isHindi && hi ? hi.title : item.title;
          let desc = isHindi && hi ? hi.desc : item.desc;
          let reason = isHindi && hi ? hi.reason : item.reason;
          let action = isHindi && hi ? hi.recommendedAction : item.recommendedAction;
          let btnText = isHindi && hi ? hi.buttonText : item.buttonText;
          let badge = isHindi && hi ? hi.badge : item.badge;
          let displayAmount = item.opportunityAmount;
          let isCardResolved = false;

          if (item.id === "radar-inactive") {
            if (isCampaignActive) {
              isCardResolved = true;
              displayAmount = 0;
              badge = isHindi ? "अभियान सक्रिय" : "Campaign Active";
              desc = isHindi
                ? "10% शाम का ऑफर ग्राहकों को भेजा जा चुका है।"
                : "10% evening offer sent to inactive customers.";
              reason = isHindi
                ? "अभियान सक्रिय है, ऑर्डर आने शुरू हो गए हैं।"
                : "Offer is live; customer orders underway.";
              action = isHindi ? "अभियान की स्थिति जांचें।" : "Monitor campaign performance.";
              btnText = isHindi ? "अभियान देखें" : "View Campaign";
            }
          } else if (item.id === "radar-stock") {
            if (isParleRestocked) {
              isCardResolved = true;
              displayAmount = 0;
              badge = isHindi ? "स्टॉक सुरक्षित" : "Restocked & Safe";
              desc = isHindi
                ? `पारले बिस्कुट अब स्टॉक में है (${parleItem?.stock} पैकेट)।`
                : `Parle biscuits restocked (${parleItem?.stock} units in inventory).`;
              reason = isHindi
                ? `स्टॉक ${parleItem?.stock} पैकेट है। शाम की चाय भीड़ सुरक्षित।`
                : `Stock is ${parleItem?.stock} units. Evening rush protected.`;
              action = isHindi ? "इन्वेंटरी स्वस्थ स्थिति में है।" : "Inventory is at healthy level.";
              btnText = isHindi ? "इन्वेंटरी देखें" : "View Inventory";
            } else if (totals.estimatedStockLoss > 0) {
              displayAmount = totals.estimatedStockLoss;
            }
          } else if (item.id === "radar-udhaar") {
            displayAmount = overdueAmt;
            if (isUdhaarRecovered) {
              isCardResolved = true;
              badge = isHindi ? "पूर्ण वसूली" : "Fully Recovered";
              desc = isHindi
                ? "सभी पुराने उधार का भुगतान हो चुका है।"
                : "All overdue customer balances cleared.";
              reason = isHindi
                ? "कोई भी ग्राहक तय समय से लेट नहीं है।"
                : "0 overdue customers remaining.";
              action = isHindi ? "खाता संतुलित और अद्यतित है।" : "Ledger is balanced and healthy.";
              btnText = isHindi ? "खाता देखें" : "View Khata";
            } else if (totals.overdueCount < 5) {
              reason = isHindi
                ? `${totals.overdueCount} ग्राहकों पर ₹${overdueAmt} बकाया है।`
                : `${totals.overdueCount} customer(s) with ₹${overdueAmt} pending.`;
            }
          }

          const isAIPrimary = item.id === "radar-inactive" && !isCardResolved;

          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl p-5 ring-1 transition-all shadow-2xs",
                isCardResolved
                  ? "ring-emerald/40 bg-emerald-light/20"
                  : isAIPrimary
                  ? "ring-rust/35 bg-rust-light/35 hover:bg-rust-light/50"
                  : "ring-line bg-paper hover:bg-cream/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      isCardResolved
                        ? "bg-emerald-light text-emerald"
                        : isAIPrimary
                        ? "bg-rust/15 text-rust"
                        : "bg-sand text-inksoft"
                    )}
                  >
                    {badge}
                  </span>
                  {onExplain && (
                    <button
                      type="button"
                      onClick={() => onExplain(title)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-rust transition-colors"
                    >
                      <HelpCircle className="size-3" />
                      {isHindi ? "क्यों?" : "Why?"}
                    </button>
                  )}
                </div>

                <h3 className="mt-2.5 font-sans text-[16px] font-semibold text-ink leading-snug">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-inksoft leading-relaxed">{desc}</p>

                {/* Estimated Opportunity Box */}
                <div
                  className={cn(
                    "mt-3 rounded-xl p-3 ring-1",
                    isCardResolved
                      ? "bg-emerald-light/40 ring-emerald/20"
                      : isAIPrimary
                      ? "bg-paper/80 ring-rust/20"
                      : "bg-cream/70 ring-line/60"
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-inksoft">
                    {isCardResolved
                      ? isHindi
                        ? "अवसर स्थिति"
                        : "Opportunity Status"
                      : isHindi
                      ? "अनुमानित अवसर"
                      : "Estimated opportunity"}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 font-sans text-xl font-semibold tabular-nums",
                      isCardResolved ? "text-emerald" : "text-rust"
                    )}
                  >
                    {isCardResolved
                      ? isHindi
                        ? "सुरक्षित / पूर्ण ✓"
                        : "Protected / Resolved ✓"
                      : `₹${displayAmount.toLocaleString("en-IN")}`}
                  </p>
                </div>

                {/* Reason & Recommendation */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "कारण: " : "Reason: "}
                    </span>
                    <span className="text-inksoft leading-relaxed">{reason}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "सिफारिश: " : "Action: "}
                    </span>
                    <span className="text-inksoft leading-relaxed">{action}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleAction(item.type)}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-2xs ring-1 transition-all active:scale-[0.98]",
                  isCardResolved
                    ? "bg-emerald text-cream ring-emerald hover:bg-emerald/90"
                    : "bg-rust text-cream ring-rust hover:bg-rust/95"
                )}
              >
                <span>{btnText}</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Total Opportunity Strip & Non-Guaranteed Disclaimer */}
      <div className="mt-4 rounded-2xl bg-paper p-4 ring-1 ring-line sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">
              {t.totalOpportunity}
            </p>
            <p className="font-sans text-3xl sm:text-4xl font-bold text-ink tabular-nums tracking-[-0.02em]">
              ₹{dynamicTotalOpportunity.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="max-w-[42ch] text-right">
            <p className="text-[11px] italic text-inksoft leading-relaxed">
              "{t.radarDisclaimer}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
