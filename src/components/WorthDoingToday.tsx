import { useState } from "react";
import { AIExplanationDialog } from "@/components/AIExplanationDialog";
import { useLanguage } from "@/lib/language-context";
import { worthDoingItems, type WorthDoingItem } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

interface WorthDoingTodayProps {
  done: Record<string, string>;
  onTriggerAction: (item: WorthDoingItem) => void;
  onSetAside: (id: string) => void;
}

const HINDI_CARD_DETAILS: Record<
  string,
  {
    title: string;
    problem: string;
    whyDetected: string[];
    recommendation: string;
    expectedImpact: string;
    actionLabel: string;
    tag: string;
  }
> = {
  "campaign-card": {
    title: "मंगलवार की बिक्री असामान्य रूप से कम है",
    problem: "बिक्री आपके सामान्य मंगलवार के औसत से 16% कम चल रही है।",
    whyDetected: [
      "240 ग्राहक पिछले 15+ दिनों से दुकान पर नहीं आए हैं",
      "शाम की कुल लेनदेन में 21% की गिरावट देखी गई है",
      "औसत बिल राशि (बास्केट साइज) सामान्य से कम है",
    ],
    recommendation: "निष्क्रिय ग्राहकों को 10% मंगलवार का ऑफर संदेश भेजें।",
    expectedImpact: "संभावित अतिरिक्त बिक्री: ₹6,100",
    actionLabel: "ऑफर देखें और भेजें",
    tag: "+₹6,100",
  },
  "inventory-card": {
    title: "पारले बिस्कुट का स्टॉक शून्य है",
    problem: "शाम 5 बजे की चाय की भीड़ से पहले वर्तमान स्टॉक 0 पैकेट है।",
    whyDetected: [
      "दैनिक औसत बिक्री: 18 पैकेट",
      "शाम की अपेक्षित मांग: 12 पैकेट",
      "अंतिम पैकेट कल शाम को बिक चुका था",
    ],
    recommendation: "शाम की भीड़ से पहले शर्मा डिस्ट्रीब्यूटर्स से 24 पैकेट मंगवाएं।",
    expectedImpact: "संभावित नुकसान से बचाव: ₹1,800",
    actionLabel: "ऑर्डर देखें",
    tag: "बचत ₹1,800",
  },
  "udhaar-card": {
    title: "अतिदेय उधार की आसान वसूली",
    problem: "5 नियमित ग्राहकों पर कुल ₹2,800 का उधार बकाया है।",
    whyDetected: [
      "तय तारीख से 5 से 14 दिन अधिक बीत चुके हैं",
      "इन ग्राहकों का पुराना भुगतान ट्रैक रिकॉर्ड काफी अच्छा रहा है",
      "पेटीएम यूपीआई लिंक भेजने से 43% तुरंत भुगतान बढ़ जाता है",
    ],
    recommendation: "व्हाट्सएप पर विनम्र संदेश व पेटीएम यूपीआई लिंक भेजें।",
    expectedImpact: "नकद वसूली: ₹2,800",
    actionLabel: "रिमाइंडर देखें",
    tag: "वसूली ₹2,800",
  },
};

export function WorthDoingToday({
  done,
  onTriggerAction,
  onSetAside,
}: WorthDoingTodayProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [whyOpen, setWhyOpen] = useState<Record<string, boolean>>({
    "campaign-card": true,
    "inventory-card": false,
    "udhaar-card": false,
  });

  const [explainContext, setExplainContext] = useState<string | null>(null);

  const toggleWhy = (id: string) => {
    setWhyOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const remainingCount = worthDoingItems.filter((item) => !done[item.id]).length;

  return (
    <section id="worth-doing-section" className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">
            {t.worthDoingTitle}
          </h2>
          <span className="rounded-full bg-rust/10 px-2.5 py-0.5 text-xs font-semibold text-rust">
            {t.mainAiBadge}
          </span>
        </div>
        <span className="text-xs text-inksoft">
          {t.actionsReady(remainingCount, worthDoingItems.length)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {worthDoingItems.map((item, index) => {
          const isDone = Boolean(done[item.id]);
          const isExpanded = Boolean(whyOpen[item.id]);
          const hindiData = HINDI_CARD_DETAILS[item.id];

          const title = isHindi && hindiData ? hindiData.title : item.title;
          const problem = isHindi && hindiData ? hindiData.problem : item.problem;
          const whyList =
            isHindi && hindiData ? hindiData.whyDetected : item.whyDetected;
          const recommendation =
            isHindi && hindiData ? hindiData.recommendation : item.recommendation;
          const impact =
            isHindi && hindiData ? hindiData.expectedImpact : item.expectedImpact;
          const actionLabel =
            isHindi && hindiData ? hindiData.actionLabel : item.actionLabel;
          const tag = isHindi && hindiData ? hindiData.tag : item.tag;

          return (
            <article
              key={item.id}
              className={cn(
                "animate-settle rounded-[20px] bg-paper p-5 ring-1 ring-line transition-all sm:p-6",
                isDone && "bg-cream/40 opacity-90",
              )}
              style={{ animationDelay: `${0.06 * (index + 1)}s` }}
            >
              {isDone ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-emerald/10 text-emerald">
                      <CheckCircle2 className="size-5" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-ink">
                        {title}
                      </p>
                      <p className="mt-0.5 text-sm text-emerald font-medium">
                        {done[item.id]}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                    {t.completed}
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                          <Lightbulb className="size-3 text-rust" />
                          {isHindi ? "एआई सिफारिश" : "AI Recommendation"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExplainContext(title)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-rust"
                        >
                          <HelpCircle className="size-3" />
                          {t.whyAmISeeingThis}
                        </button>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold text-ink leading-snug sm:text-xl">
                        {title}
                      </h3>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                        item.tagTone === "gain"
                          ? "bg-emerald/10 text-emerald"
                          : "bg-sand text-ink",
                      )}
                    >
                      {tag}
                    </span>
                  </div>

                  {/* 1. Problem Detected */}
                  <div className="rounded-xl bg-cream/70 p-3.5 ring-1 ring-line/60">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-inksoft">
                      {t.problemDetected}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {problem}
                    </p>
                  </div>

                  {/* 2. Why Bharat detected it */}
                  <div className="border-t border-line/70 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleWhy(item.id)}
                      className="flex w-full items-center justify-between text-xs font-semibold text-inksoft hover:text-ink"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-rust" />
                        {t.whyDetected} ({whyList.length} {isHindi ? "संकेत" : "signals"})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="mt-2.5 space-y-1.5 pl-5 text-xs text-inksoft list-disc">
                        {whyList.map((reason, i) => (
                          <li key={i} className="leading-relaxed">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* 3. Recommended Action & 4. Expected Impact */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-paper p-3 ring-1 ring-line">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-inksoft">
                        {t.recommendedAction}
                      </p>
                      <p className="mt-1 text-xs font-medium text-ink leading-relaxed">
                        {recommendation}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald/5 p-3 ring-1 ring-emerald/20">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald">
                        {t.expectedImpact}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-emerald leading-relaxed">
                        {impact}
                      </p>
                    </div>
                  </div>

                  {/* 5. Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onTriggerAction(item)}
                      className="rounded-full bg-rust px-5 py-2.5 text-sm font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98]"
                    >
                      {actionLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetAside(item.id)}
                      className="rounded-full px-4 py-2.5 text-sm font-medium text-inksoft hover:bg-sand/60 active:scale-[0.98]"
                    >
                      {t.setAside}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <AIExplanationDialog
        open={Boolean(explainContext)}
        onOpenChange={(open) => !open && setExplainContext(null)}
        contextTitle={explainContext ?? undefined}
      />
    </section>
  );
}
