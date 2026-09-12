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
            <span className="grid size-6 place-items-center rounded-md bg-rust/10 text-rust">
              <Radar className="size-3.5 animate-pulse" />
            </span>
            <h2 className="font-display text-xl font-semibold text-ink">
              {t.radarTitle}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-inksoft">{t.radarSub}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-semibold text-emerald">
          <Sparkles className="size-3" />
          {isHindi ? "3 नए अवसर मिले" : "3 Live Opportunities"}
        </span>
      </div>

      {/* 3 Opportunity Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {opportunityRadarData.items.map((item) => {
          const hi = HINDI_RADAR_ITEMS[item.id];
          const title = isHindi && hi ? hi.title : item.title;
          const desc = isHindi && hi ? hi.desc : item.desc;
          const reason = isHindi && hi ? hi.reason : item.reason;
          const action = isHindi && hi ? hi.recommendedAction : item.recommendedAction;
          const btnText = isHindi && hi ? hi.buttonText : item.buttonText;
          const badge = isHindi && hi ? hi.badge : item.badge;

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-[20px] bg-paper p-5 ring-1 ring-line transition-all hover:ring-rust/30 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-inksoft">
                    {badge}
                  </span>
                  {onExplain && (
                    <button
                      type="button"
                      onClick={() => onExplain(title)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-rust"
                    >
                      <HelpCircle className="size-3" />
                      {isHindi ? "क्यों?" : "Why?"}
                    </button>
                  )}
                </div>

                <h3 className="mt-2.5 font-display text-base font-semibold text-ink leading-snug">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-inksoft">{desc}</p>

                {/* Estimated Opportunity Box */}
                <div className="mt-3 rounded-xl bg-cream/70 p-3 ring-1 ring-line/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-inksoft">
                    {isHindi ? "अनुमानित अवसर" : "Estimated opportunity"}
                  </p>
                  <p className="mt-0.5 font-display text-xl font-bold text-rust">
                    ₹{item.opportunityAmount.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Reason & Recommendation */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "कारण: " : "Reason: "}
                    </span>
                    <span className="text-inksoft">{reason}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "सिफारिश: " : "Action: "}
                    </span>
                    <span className="text-inksoft">{action}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleAction(item.type)}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rust py-2.5 text-xs font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98]"
              >
                <span>{btnText}</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Total Opportunity Strip & Non-Guaranteed Disclaimer */}
      <div className="mt-4 rounded-[18px] bg-sand/40 p-4 ring-1 ring-line sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">
              {t.totalOpportunity}
            </p>
            <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
              ₹{opportunityRadarData.totalOpportunity.toLocaleString("en-IN")}
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
