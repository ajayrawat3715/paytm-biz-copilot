import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { counterUpsellRules, deadStockCombos } from "@/lib/mock-data";
import { playPaytmChime, speakSoundboxAlert } from "@/lib/soundbox-audio";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Volume2,
  Zap,
} from "lucide-react";

export function BasketBoosterWidget() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [selectedRuleId, setSelectedRuleId] = useState<string>(counterUpsellRules[0].id);
  const [pitchedMap, setPitchedMap] = useState<Record<string, boolean>>({});

  const selectedRule =
    counterUpsellRules.find((r) => r.id === selectedRuleId) || counterUpsellRules[0];

  const handleSimulatePitch = (rule: typeof selectedRule) => {
    playPaytmChime();
    setPitchedMap((prev) => ({ ...prev, [rule.id]: true }));

    const spokenText = isHindi
      ? `सुझाव कॉम्बो: ${rule.primaryItem} के साथ ${rule.upsellItem}`
      : `Recommended pair: ${rule.upsellItem} with ${rule.primaryItem}`;

    speakSoundboxAlert(spokenText, isHindi ? "hi" : "en");
  };

  return (
    <section className="mt-8 animate-settle">
      <div className="rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6 shadow-2xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-rust/10 text-rust">
                <ShoppingBag className="size-4" />
              </span>
              <span className="rounded-full bg-rust-light px-2.5 py-0.5 text-xs font-semibold text-rust">
                {isHindi ? "काउंटर अपसेल इंजन" : "Counter Cross-Sell Engine"}
              </span>
              <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald tabular-nums">
                {isHindi ? "औसत बिल: ₹146 ➔ ₹185 (+26%)" : "Avg Ticket: ₹146 ➔ ₹185 (+26%)"}
              </span>
            </div>
            <h2 className="mt-2 font-sans text-lg font-semibold text-ink sm:text-xl">
              {t.basketBoosterTitle}
            </h2>
            <p className="mt-0.5 text-xs text-inksoft">
              {t.basketBoosterSub}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald bg-emerald-light px-3 py-1.5 rounded-full ring-1 ring-emerald/30 tabular-nums">
            <TrendingUp className="size-3.5" />
            <span>{isHindi ? "+₹12,400 अतिरिक्त मासिक शुद्ध लाभ" : "+₹12,400 Net Profit/Mo"}</span>
          </div>
        </div>

        {/* Primary Item Selector Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {counterUpsellRules.map((rule) => {
            const isSelected = rule.id === selectedRule.id;
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => setSelectedRuleId(rule.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-2xs",
                  isSelected
                    ? "bg-rust text-cream shadow-xs"
                    : "bg-sand text-ink hover:bg-paper ring-1 ring-line"
                )}
              >
                {rule.primaryItem.split(" ")[0]} ({rule.ticketExpansion})
              </button>
            );
          })}
        </div>

        {/* Selected Cross-Sell Dynamic Showcase */}
        <div className="mt-4 rounded-xl bg-sand/30 p-4 sm:p-5 ring-1 ring-line">
          <div className="flex items-center justify-between pb-3 border-b border-line/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-inksoft">
              {selectedRule.category}
            </span>
            <span className="rounded-full bg-emerald text-cream px-2.5 py-0.5 text-[10px] font-semibold tabular-nums">
              {selectedRule.ticketExpansion} {isHindi ? "बिल विस्तार" : "Ticket Expansion"}
            </span>
          </div>

          {/* Product Pair Comparison */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 items-center">
            {/* Primary Item (Low Margin Staple) */}
            <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-inksoft">
                  {isHindi ? "ग्राहक की प्राथमिक मांग" : "Primary Staple"}
                </span>
                <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] text-ink font-semibold tabular-nums">
                  {selectedRule.primaryMargin} {isHindi ? "मार्जिन" : "margin"}
                </span>
              </div>
              <p className="mt-2 font-sans text-sm font-semibold text-ink">{selectedRule.primaryItem}</p>
              <p className="mt-1 font-sans text-lg font-bold text-inksoft tabular-nums">
                ₹{selectedRule.primaryPrice}
              </p>
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center">
              <span className="grid size-8 place-items-center rounded-full bg-rust text-cream shadow-2xs font-semibold text-sm">
                +
              </span>
            </div>

            {/* High-Margin Upsell Item */}
            <div className="rounded-xl bg-paper p-4 ring-1 ring-emerald/40 border border-emerald/30 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald flex items-center gap-1">
                  <Sparkles className="size-3 text-rust" />
                  {isHindi ? "एआई काउंटर सुझाव" : "High-Margin Upsell"}
                </span>
                <span className="rounded bg-emerald-light px-1.5 py-0.5 text-[10px] text-emerald font-semibold tabular-nums">
                  {selectedRule.upsellMargin} {isHindi ? "मार्जिन" : "margin"}
                </span>
              </div>
              <p className="mt-2 font-sans text-sm font-semibold text-ink">{selectedRule.upsellItem}</p>
              <p className="mt-1 font-sans text-lg font-bold text-emerald tabular-nums">
                +₹{selectedRule.upsellPrice}
              </p>
            </div>
          </div>

          {/* Natural Verbal Counter Pitch */}
          <div className="mt-4 rounded-xl bg-cream/70 p-3.5 ring-1 ring-line flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 max-w-xl">
              <span className="grid size-6 place-items-center rounded-full bg-rust text-cream font-sans font-semibold text-xs shrink-0 mt-0.5">
                भ
              </span>
              <div>
                <p className="text-[11px] font-semibold text-ink">
                  {isHindi ? "दुकानदार के लिए काउंटर संवाद (Verbal Counter Pitch):" : "Counter Suggestion Script:"}
                </p>
                <p className="mt-0.5 text-xs text-inksoft italic leading-relaxed">
                  "{isHindi ? selectedRule.pitchHi : selectedRule.pitchEn}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[10px] text-inksoft">{isHindi ? "नया कुल बिल" : "Combined Bill"}</p>
                <p className="font-sans text-base font-bold text-ink tabular-nums">₹{selectedRule.combinedPrice}</p>
              </div>

              <button
                type="button"
                onClick={() => handleSimulatePitch(selectedRule)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs active:scale-95",
                  pitchedMap[selectedRule.id]
                    ? "bg-emerald text-cream"
                    : "bg-rust text-cream hover:bg-rust/95"
                )}
              >
                {pitchedMap[selectedRule.id] ? (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>{isHindi ? "सुझाया गया" : "Pitched"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5" />
                    <span>{isHindi ? "सुझाव बोलें" : "Pitch Upsell"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dead Stock Clearance Combos Strip */}
        <div className="mt-5">
          <p className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Package className="size-3.5 text-rust" />
            <span>{t.deadStockTitle}</span>
            <span className="text-[10px] text-inksoft font-normal">
              ({isHindi ? "धीमी गति वाले सामान को कॉम्बो में निकालकर पूंजी खाली करें" : "Liquidate slow inventory while protecting gross margin"})
            </span>
          </p>

          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deadStockCombos.map((combo) => (
              <div
                key={combo.id}
                className="rounded-xl bg-sand/30 p-3.5 ring-1 ring-line/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-xs font-bold text-ink">{combo.title}</p>
                    <span className="rounded bg-emerald/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald">
                      {combo.margin} margin
                    </span>
                  </div>
                  <p className="text-[11px] text-inksoft mt-0.5">{combo.items}</p>
                  <p className="text-[10px] text-emerald font-semibold mt-0.5">
                    {isHindi ? combo.benefitHi : combo.benefitEn}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-inksoft line-through tabular-nums">₹{combo.mrp}</span>
                  <p className="font-sans text-sm font-bold text-rust tabular-nums">₹{combo.comboPrice}</p>
                  <button
                    type="button"
                    onClick={() => {
                      playPaytmChime();
                      speakSoundboxAlert(
                        isHindi ? `${combo.title} कॉम्बो तैयार है` : `${combo.title} combo activated`,
                        isHindi ? "hi" : "en"
                      );
                    }}
                    className="mt-1 rounded-full bg-paper px-2.5 py-0.5 text-[10px] font-semibold text-ink ring-1 ring-line hover:bg-sand"
                  >
                    {isHindi ? "सक्रिय करें" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
