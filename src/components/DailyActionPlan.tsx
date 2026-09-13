import { useLanguage } from "@/lib/language-context";
import { actionPlanData, type ActionPlanItem } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  ListTodo,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface DailyActionPlanProps {
  onOpenCampaign: () => void;
  onOpenInventory: () => void;
  onOpenUdhaar: () => void;
  onReviewAllActions: () => void;
  onExplain?: (title: string) => void;
}

const HINDI_PLAN_ITEMS: Record<
  string,
  {
    priorityBadge: string;
    title: string;
    why: string;
    impact: string;
    buttonText: string;
  }
> = {
  "plan-inventory": {
    priorityBadge: "🔴 अति आवश्यक प्राथमिकता",
    title: "पारले बिस्कुट रीस्टॉक करें",
    why: "वर्तमान स्टॉक 0 है और औसत दैनिक बिक्री 18 पैकेट है।",
    impact: "संभावित ₹1,800 की बिक्री के नुकसान से बचाव।",
    buttonText: "समीक्षा करें",
  },
  "plan-campaign": {
    priorityBadge: "🟠 वृद्धि का अवसर",
    title: "निष्क्रिय ग्राहकों को वापस लाएं",
    why: "240 ग्राहक पिछले 15+ दिनों से दुकान पर नहीं आए हैं।",
    impact: "अनुमानित अतिरिक्त अवसर: ₹6,100।",
    buttonText: "समीक्षा करें",
  },
  "plan-udhaar": {
    priorityBadge: "🟢 नकद वसूली",
    title: "अतिदेय उधार पर फॉलो-अप करें",
    why: "₹2,800 बकाया है। 5 ग्राहकों पर ध्यान देने की आवश्यकता है।",
    impact: "रुकी हुई नकद वसूली: ₹2,800।",
    buttonText: "समीक्षा करें",
  },
};

export function DailyActionPlan({
  onOpenCampaign,
  onOpenInventory,
  onOpenUdhaar,
  onReviewAllActions,
  onExplain,
}: DailyActionPlanProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const handleAction = (type: "inventory" | "campaign" | "udhaar") => {
    if (type === "campaign") onOpenCampaign();
    else if (type === "inventory") onOpenInventory();
    else if (type === "udhaar") onOpenUdhaar();
  };

  return (
    <section id="daily-action-plan-section" className="mt-8 animate-settle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-rust/10 text-rust">
              <ListTodo className="size-3.5" />
            </span>
            <h2 className="font-sans text-[22px] sm:text-[24px] font-bold text-ink leading-[1.2] tracking-[-0.02em]">
              {t.actionPlanTitle}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-inksoft">{t.actionPlanSub}</p>
        </div>

        {/* Big Review All Actions Button */}
        <button
          type="button"
          onClick={onReviewAllActions}
          className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-cream shadow-2xs hover:bg-ink/90 active:scale-[0.98] transition-all"
        >
          <Sparkles className="size-3.5 text-rust" />
          <span>{t.reviewAllActions}</span>
          <ArrowRight className="size-3" />
        </button>
      </div>

      {/* 3 Ranked Priorities */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {actionPlanData.items.map((item, idx) => {
          const itemNum = String(idx + 1).padStart(2, "0");
          const hi = HINDI_PLAN_ITEMS[item.id];
          const badge = isHindi && hi ? hi.priorityBadge : item.priorityBadge;
          const title = isHindi && hi ? hi.title : item.title;
          const why = isHindi && hi ? hi.why : item.why;
          const impact = isHindi && hi ? hi.impact : item.impact;
          const btnText = isHindi && hi ? hi.buttonText : item.buttonText;

          const isWarning = item.priorityColor === "red";
          const isGrowth = item.priorityColor === "orange";
          const isCash = item.priorityColor === "green";

          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl bg-paper p-5 ring-1 ring-line transition-all shadow-2xs",
                isWarning
                  ? "border-l-[3px] border-l-warning hover:bg-warning-light/15"
                  : isGrowth
                  ? "border-l-[3px] border-l-rust bg-rust-light/25 hover:bg-rust-light/35"
                  : "border-l-[3px] border-l-emerald hover:bg-emerald-light/15",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded-md bg-sand text-[11px] font-bold tabular-nums text-ink ring-1 ring-line">
                      {itemNum}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink">
                      {badge}
                    </span>
                  </div>
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

                <h3 className="mt-3 font-sans text-[16px] font-semibold text-ink leading-snug">
                  "{title}"
                </h3>

                <div className="mt-3 space-y-2 rounded-xl bg-cream/70 p-3 text-xs ring-1 ring-line/60">
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "कारण: " : "Why: "}
                    </span>
                    <span className="text-inksoft leading-relaxed">{why}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-ink">
                      {isHindi ? "प्रभाव: " : "Impact: "}
                    </span>
                    <span className="font-semibold text-emerald leading-relaxed">
                      {impact}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAction(item.type)}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand py-2 text-xs font-semibold text-ink ring-1 ring-line hover:bg-paper active:scale-[0.98] transition-all"
              >
                <span>{btnText}</span>
                <ArrowRight className="size-3 text-rust" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
