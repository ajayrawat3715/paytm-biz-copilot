import { useState } from "react";
import { dailyCash, morningForecast, rupees } from "@/lib/khata";
import { useKiranaData } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react";
import { PaytmApiBadge } from "@/components/PaytmApiBadge";

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
  const { totals, inventory, activeCampaigns, autopilotCompleted } = useKiranaData();

  const [isComputing, setIsComputing] = useState(false);

  const isUdhaarResolved = totals.overdueAmount === 0;
  const parleItem = inventory.find((i) => i.id === "inv-1");
  const isParleRestocked = parleItem ? parleItem.stock > 0 : false;
  const isCampaignActive = !!activeCampaigns["lapsed-10"] || !!activeCampaigns["tuesday-flash"];
  const isAllResolved =
    autopilotCompleted || (isUdhaarResolved && isParleRestocked && isCampaignActive);

  const handleRecompute = () => {
    setIsComputing(true);
    setTimeout(() => {
      setIsComputing(false);
    }, 1200);
  };

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecompute}
            disabled={isComputing}
            className="inline-flex items-center gap-1 rounded-full bg-sand/80 px-2.5 py-0.5 text-[11px] font-medium text-inksoft ring-1 ring-line hover:bg-paper active:scale-95 transition-all"
            title="Click to re-compute Paytm transaction run-rate"
          >
            <RefreshCw className={cn("size-3 text-rust", isComputing && "animate-spin")} />
            <span>{isComputing ? (isHindi ? "विश्लेषण जारी..." : "Computing...") : (isHindi ? "पुनः विश्लेषण" : "Re-sync")}</span>
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/80 px-2.5 py-0.5 text-[11px] font-medium text-inksoft ring-1 ring-line">
            <Sparkles className="size-3 text-rust" />
            {isHindi ? "एआई प्रभात इनसाइट्स सक्रिय" : "AI Morning Intelligence Active"}
          </span>
        </div>
      </div>

      <h1 className="mt-2.5 max-w-[36ch] text-balance font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {t.morningGreeting}
        <br />
        <span className="text-inksoft">{t.quietSubtitle}</span>
      </h1>

      {/* Forecast & Metrics Banner */}
      <div className="mt-5 rounded-[20px] bg-paper p-5 ring-1 ring-line sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-[260px]">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <div className="flex items-center gap-2 text-rust">
                <TrendingDown className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t.forecastTitle}
                </span>
              </div>
              <PaytmApiBadge type="forecast" />
            </div>

            {isComputing ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-7 w-4/5 rounded-lg bg-sand/80 animate-pulse" />
                <Skeleton className="h-4 w-3/5 rounded-md bg-sand/60 animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
                  {t.forecastText(currentDayName)}
                </p>
                <p className="text-xs text-inksoft">
                  {t.forecastSub(dailyCash.cashSales, morningForecast.usualSales)}
                </p>
              </>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-inksoft">{t.collectedSoFar}</p>
            {isComputing ? (
              <Skeleton className="h-9 w-28 ml-auto my-1 rounded-lg bg-sand/80 animate-pulse" />
            ) : (
              <p className="mt-0.5 font-display text-3xl font-semibold leading-none text-ink sm:text-[38px]">
                {rupees(collectedToday)}
              </p>
            )}
            <div className="mt-2 flex items-center justify-end gap-1" aria-label="last 8 days trend">
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
              <span className="inline-flex items-center gap-1 text-emerald">
                <span className="size-1.5 animate-tick rounded-full bg-emerald" />
                live
              </span>
            </p>
          </div>
        </div>

        {/* Empty / Completed Banner when all 3 actions are approved */}
        {isAllResolved && (
          <div className="mt-4 rounded-xl bg-emerald/10 border border-emerald/25 p-3 text-ink flex items-center justify-between gap-3 animate-settle">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-emerald text-white">
                <CheckCircle2 className="size-3.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-emerald-800">
                  {isHindi ? "3 प्राथमिकताएं निर्धारित हैं!" : "3 actions scheduled for today"}
                </p>
                <p className="text-[11px] text-emerald-700/80">
                  {isHindi
                    ? "दुकान आज 94% दक्षता पर चल रही है। सभी मुख्य कार्य निष्पादित हैं।"
                    : "All clear! Store running smoothly with zero unaddressed cash leaks or stockouts."}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald">
              Autopilot Active
            </span>
          </div>
        )}

        {/* 3 AI Generated Priorities */}
        <div className="mt-5 border-t border-line pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
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
              className="inline-flex items-center gap-1 text-xs font-semibold text-rust hover:underline"
            >
              {t.reviewAll}
              <ArrowRight className="size-3" />
            </button>
          </div>

          {isComputing ? (
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Skeleton className="h-44 w-full rounded-2xl bg-sand/60 animate-pulse" />
              <Skeleton className="h-44 w-full rounded-2xl bg-sand/60 animate-pulse" />
              <Skeleton className="h-44 w-full rounded-2xl bg-sand/60 animate-pulse" />
            </div>
          ) : (
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Priority 1 */}
              <div
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 ring-1 transition-all",
                  isCampaignActive
                    ? "bg-emerald/5 ring-emerald/30 hover:bg-emerald/10"
                    : "bg-cream/60 ring-line/80 hover:bg-cream",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        isCampaignActive
                          ? "bg-emerald/15 text-emerald"
                          : "bg-emerald/10 text-emerald",
                      )}
                    >
                      {isCampaignActive ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <Users className="size-3" />
                      )}
                      {isHindi ? "प्राथमिकता 1" : "Priority 1"}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        isCampaignActive ? "text-emerald font-bold" : "text-emerald",
                      )}
                    >
                      {isCampaignActive
                        ? isHindi
                          ? "✓ अभियान सक्रिय"
                          : "✓ Active"
                        : "+₹6,100"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-[15px] font-semibold text-ink leading-snug">
                    {t.p1Title}
                  </h3>
                  <p className="mt-1 text-xs text-inksoft leading-relaxed">
                    {isCampaignActive
                      ? isHindi
                        ? "10% शाम का ऑफर 240 ग्राहकों को भेजा जा चुका है।"
                        : "10% offer scheduled for 240 inactive regulars."
                      : t.p1Desc}
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink">
                    {t.p1Impact}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenCampaign}
                  className={cn(
                    "mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-sm active:scale-[0.98] transition-all",
                    isCampaignActive
                      ? "bg-emerald text-white hover:bg-emerald/90"
                      : "bg-rust text-cream hover:opacity-95",
                  )}
                >
                  {isCampaignActive ? (
                    <span>{isHindi ? "अभियान देखें" : "View Campaign"}</span>
                  ) : (
                    <>
                      <span>{t.p1Action}</span>
                      <ArrowRight className="size-3" />
                    </>
                  )}
                </button>
              </div>

              {/* Priority 2 */}
              <div
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 ring-1 transition-all",
                  isParleRestocked
                    ? "bg-emerald/5 ring-emerald/30 hover:bg-emerald/10"
                    : "bg-cream/60 ring-line/80 hover:bg-cream",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        isParleRestocked
                          ? "bg-emerald/15 text-emerald"
                          : "bg-amber-500/10 text-amber-700",
                      )}
                    >
                      {isParleRestocked ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <AlertTriangle className="size-3" />
                      )}
                      {isHindi ? "प्राथमिकता 2" : "Priority 2"}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        isParleRestocked ? "text-emerald font-bold" : "text-amber-700",
                      )}
                    >
                      {isParleRestocked
                        ? isHindi
                          ? "✓ ऑर्डर भेजा गया"
                          : "✓ Order Sent"
                        : isHindi
                        ? "नुकसान से बचें"
                        : "Avoid loss"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-[15px] font-semibold text-ink leading-snug">
                    {isParleRestocked
                      ? isHindi
                        ? "पारले बिस्कुट पुनःऑर्डर भेजा गया"
                        : "Parle Restock PO Sent"
                      : t.p2Title}
                  </h3>
                  <p className="mt-1 text-xs text-inksoft leading-relaxed">
                    {isParleRestocked
                      ? isHindi
                        ? "शर्मा डिस्ट्रीब्यूटर्स को 24 पैकेट का ऑर्डर सफलतापूर्वक भेजा गया।"
                        : "24 units purchase order dispatched to Sharma Distributors."
                      : t.p2Desc}
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink">
                    {isParleRestocked
                      ? isHindi
                        ? "शाम 4 बजे तक डिलीवरी अपेक्षित"
                        : "Expected delivery by 4 PM"
                      : t.p2Impact}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenInventory}
                  className={cn(
                    "mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-sm active:scale-[0.98] transition-all",
                    isParleRestocked
                      ? "bg-emerald text-white hover:bg-emerald/90"
                      : "bg-sand text-ink ring-1 ring-line hover:bg-paper",
                  )}
                >
                  {isParleRestocked ? (
                    <span>{isHindi ? "ऑर्डर स्थिति देखें" : "View PO Status"}</span>
                  ) : (
                    <>
                      <span>{t.p2Action}</span>
                      <ArrowRight className="size-3" />
                    </>
                  )}
                </button>
              </div>

              {/* Priority 3 */}
              <div
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 ring-1 transition-all",
                  isUdhaarResolved
                    ? "bg-emerald/5 ring-emerald/30 hover:bg-emerald/10"
                    : "bg-cream/60 ring-line/80 hover:bg-cream",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        isUdhaarResolved
                          ? "bg-emerald/15 text-emerald"
                          : "bg-sand text-inksoft",
                      )}
                    >
                      {isUdhaarResolved ? (
                        <CheckCircle2 className="size-3 text-emerald" />
                      ) : (
                        <Clock className="size-3" />
                      )}
                      {isHindi ? "प्राथमिकता 3" : "Priority 3"}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        isUdhaarResolved ? "text-emerald font-bold" : "text-ink",
                      )}
                    >
                      {isUdhaarResolved
                        ? isHindi
                          ? "✓ वसूल हुआ (+₹2,800)"
                          : "✓ Recovered (+₹2,800)"
                        : isHindi
                        ? "कैश रिकवर"
                        : "Recover cash"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-[15px] font-semibold text-ink leading-snug">
                    {isUdhaarResolved
                      ? isHindi
                        ? "उधार वसूली संपन्न"
                        : "Overdue Udhaar Recovered"
                      : t.p3Title}
                  </h3>
                  <p className="mt-1 text-xs text-inksoft leading-relaxed">
                    {isUdhaarResolved
                      ? isHindi
                        ? "पेटीएम यूपीआई लिंक द्वारा सभी पुराने खाते वसूल हो गए हैं।"
                        : "All overdue balances cleared via Paytm UPI link."
                      : t.p3Desc}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      isUdhaarResolved ? "text-emerald font-semibold" : "text-ink",
                    )}
                  >
                    {isUdhaarResolved
                      ? isHindi
                        ? "काउंटर नकद में ₹2,800 जुड़ गया"
                        : "₹2,800 added to counter cash"
                      : t.p3Impact}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenUdhaar}
                  className={cn(
                    "mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-sm active:scale-[0.98] transition-all",
                    isUdhaarResolved
                      ? "bg-emerald text-white hover:bg-emerald/90"
                      : "bg-sand text-ink ring-1 ring-line hover:bg-paper",
                  )}
                >
                  <span>
                    {isUdhaarResolved
                      ? isHindi
                        ? "खाता देखें"
                        : "View Khata"
                      : t.p3Action}
                  </span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
