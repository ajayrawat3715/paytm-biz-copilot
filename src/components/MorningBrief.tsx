import { dailyCash, morningForecast, rupees } from "@/lib/khata";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";

interface MorningBriefProps {
  collectedToday: number;
  onOpenCampaign: () => void;
  onOpenInventory: () => void;
  onOpenUdhaar: () => void;
  onReviewAll: () => void;
}

export function MorningBrief({
  collectedToday,
  onOpenCampaign,
  onOpenInventory,
  onOpenUdhaar,
  onReviewAll,
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

  return (
    <section className="mt-7 animate-settle">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-rust">
          {formattedDate} · IST
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/80 px-2.5 py-0.5 text-[11px] font-medium text-inksoft ring-1 ring-line">
          <Sparkles className="size-3 text-rust" />
          {isHindi ? "एआई प्रभात इनसाइट्स सक्रिय" : "AI Morning Intelligence Active"}
        </span>
      </div>

      <h1 className="mt-3 text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-[44px] lg:text-[48px]">
        {t.morningGreeting}
      </h1>
      <p className="mt-1 text-balance font-sans text-xl font-medium leading-[1.15] tracking-tight text-inksoft sm:text-[28px] lg:text-[32px]">
        {t.quietSubtitle}
      </p>

      {/* Forecast & Metrics Banner */}
      <div className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-line shadow-xs sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rust">
              <TrendingDown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.forecastTitle}
              </span>
            </div>
            <p className="font-sans text-xl font-semibold text-ink sm:text-2xl">
              {t.forecastText(currentDayName)}
            </p>
            <p className="text-xs text-inksoft sm:text-[13px] leading-relaxed">
              {t.forecastSub(dailyCash.cashSales, morningForecast.usualSales)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-inksoft">{t.collectedSoFar}</p>
            <p className="mt-0.5 font-sans text-3xl font-semibold leading-none text-ink tabular-nums sm:text-[40px]">
              {rupees(collectedToday)}
            </p>
            <div className="mt-2.5 flex items-center justify-end gap-1" aria-label="last 8 days trend">
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

        {/* 3 AI Generated Priorities */}
        <div className="mt-6 border-t border-line pt-5">
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

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {/* Priority 1 - AI Opportunity (Terracotta Accent Card) */}
            <div className="flex flex-col justify-between rounded-2xl bg-rust-light/35 p-4 ring-1 ring-rust/35 transition-all hover:bg-rust-light/50">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rust/15 px-2.5 py-0.5 text-[11px] font-semibold text-rust">
                    <Users className="size-3" />
                    {isHindi ? "प्राथमिकता 1" : "Priority 1"}
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
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rust py-2 text-xs font-semibold text-cream shadow-xs transition-all hover:bg-rust/95 active:scale-[0.98]"
              >
                {t.p1Action}
                <ArrowRight className="size-3" />
              </button>
            </div>

            {/* Priority 2 - Stockout Risk (Amber Warning Card) */}
            <div className="flex flex-col justify-between rounded-2xl bg-paper p-4 ring-1 ring-line transition-all hover:border-warning/60 hover:bg-warning-light/20">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                    <AlertTriangle className="size-3" />
                    {isHindi ? "प्राथमिकता 2" : "Priority 2"}
                  </span>
                  <span className="text-[11px] font-medium text-warning">
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

            {/* Priority 3 - Cash Recovery Card */}
            <div className="flex flex-col justify-between rounded-2xl bg-paper p-4 ring-1 ring-line transition-all hover:border-emerald/40 hover:bg-emerald-light/20">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-light px-2.5 py-0.5 text-[11px] font-semibold text-emerald">
                    <Clock className="size-3" />
                    {isHindi ? "प्राथमिकता 3" : "Priority 3"}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald tabular-nums">
                    ₹3,450
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
