import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { storeFinancials, type FinancialPeriodData } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Receipt,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";

type TimeframeKey = "daily" | "weekly" | "monthly" | "yearly";

export function HeaderFinancialGraph() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [timeframe, setTimeframe] = useState<TimeframeKey>("daily");
  const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(true);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeIntervalIndex, setActiveIntervalIndex] = useState<number | null>(null);

  const currentData: FinancialPeriodData = storeFinancials[timeframe];

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      const lakhs = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 2);
      return `₹${lakhs}L`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  // Compute max sales in chartData for bar scaling
  const maxSales = Math.max(...currentData.chartData.map((d) => d.sales), 1);

  // Revenue waterfall percentages
  const expensePct = Math.round((currentData.expenses / currentData.sales) * 1000) / 10;
  const lossPct = Math.round((currentData.loss / currentData.sales) * 1000) / 10;
  const profitPct = Math.max(0, Math.round((currentData.netProfit / currentData.sales) * 1000) / 10);

  const timeframes: { key: TimeframeKey; label: string }[] = [
    { key: "daily", label: t.timeframeDaily },
    { key: "weekly", label: t.timeframeWeekly },
    { key: "monthly", label: t.timeframeMonthly },
    { key: "yearly", label: t.timeframeYearly },
  ];

  return (
    <section className="border-t border-line bg-paper/90 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-[1180px] px-3 sm:px-6 py-2 sm:py-2.5">
        {/* Top Control Bar: Timeframe Selector + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Timeframe Pills */}
          <div className="flex items-center gap-1 rounded-full bg-sand/70 p-1 ring-1 ring-line/70">
            {timeframes.map((tf) => {
              const active = timeframe === tf.key;
              return (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => {
                    setTimeframe(tf.key);
                    setActiveIntervalIndex(null);
                  }}
                  className={cn(
                    "rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-semibold transition-all",
                    active
                      ? "bg-rust text-cream shadow-sm scale-100"
                      : "text-inksoft hover:text-ink hover:bg-paper/80"
                  )}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Right Header Buttons: Graph Toggle & Itemized Details */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDetailModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink ring-1 ring-line hover:bg-sand/60 transition-colors"
              title={t.viewItemized}
            >
              <FileText className="size-3.5 text-rust" />
              <span className="hidden sm:inline">{t.viewItemized}</span>
              <span className="sm:hidden">{isHindi ? "ब्योरा" : "Details"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGraphExpanded(!isGraphExpanded)}
              className="inline-flex items-center gap-1 rounded-full bg-sand/60 px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-line/80 hover:bg-sand transition-all"
            >
              <BarChart3 className="size-3.5 text-rust" />
              <span className="hidden sm:inline">
                {isGraphExpanded ? t.hideGraph : t.viewGraph}
              </span>
              {isGraphExpanded ? (
                <ChevronUp className="size-3.5 text-inksoft" />
              ) : (
                <ChevronDown className="size-3.5 text-inksoft" />
              )}
            </button>
          </div>
        </div>

        {/* 4 Core Financial Metrics Cards */}
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. Total Sales */}
          <div className="rounded-xl bg-sand/40 p-2.5 sm:p-3 ring-1 ring-line hover:bg-sand/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-inksoft flex items-center gap-1">
                <Wallet className="size-3 text-slate-700" />
                {t.metricSales}
              </span>
              <span className="text-[10px] text-emerald font-semibold flex items-center">
                <ArrowUpRight className="size-3" />
                {timeframe === "daily" ? "+14%" : "+8.5%"}
              </span>
            </div>
            <p className="mt-1 font-display text-base sm:text-xl font-bold text-ink leading-none">
              ₹{currentData.sales.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-inksoft truncate">
              {isHindi
                ? `साउंडबॉक्स UPI: ₹${currentData.soundboxUpi.toLocaleString("en-IN")}`
                : `Soundbox UPI: ₹${currentData.soundboxUpi.toLocaleString("en-IN")}`}
            </p>
          </div>

          {/* 2. Expenses */}
          <div className="rounded-xl bg-amber-50/50 p-2.5 sm:p-3 ring-1 ring-amber-200/60 hover:bg-amber-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-amber-900 flex items-center gap-1">
                <Receipt className="size-3 text-amber-700" />
                {t.metricExpenses}
              </span>
              <span className="text-[10px] text-amber-800 font-semibold">
                {expensePct}%
              </span>
            </div>
            <p className="mt-1 font-display text-base sm:text-xl font-bold text-amber-950 leading-none">
              ₹{currentData.expenses.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-amber-800/80 truncate">
              {isHindi ? "माल खरीद व दुकान खर्च" : "Wholesale Stock + Ops"}
            </p>
          </div>

          {/* 3. Loss / Wastage */}
          <div className="rounded-xl bg-rose-50/50 p-2.5 sm:p-3 ring-1 ring-rose-200/60 hover:bg-rose-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-rose-900 flex items-center gap-1">
                <AlertTriangle className="size-3 text-rose-600" />
                {t.metricLoss}
              </span>
              <span className="text-[10px] text-rose-700 font-semibold">
                {lossPct}%
              </span>
            </div>
            <p className="mt-1 font-display text-base sm:text-xl font-bold text-rose-950 leading-none">
              ₹{currentData.loss.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-rose-700/80 truncate">
              {isHindi ? "खराबी, एक्सपायरी व डैमेज" : "Spoilage, Expiry & Leakage"}
            </p>
          </div>

          {/* 4. Net Profit */}
          <div className="rounded-xl bg-emerald/10 p-2.5 sm:p-3 ring-1 ring-emerald/30 hover:bg-emerald/15 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald flex items-center gap-1">
                <Sparkles className="size-3 text-emerald" />
                {t.metricProfit}
              </span>
              <span className="rounded-full bg-emerald/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald">
                +{currentData.marginPercent}%
              </span>
            </div>
            <p className="mt-1 font-display text-base sm:text-xl font-bold text-emerald leading-none">
              +₹{currentData.netProfit.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-emerald/80 truncate">
              {isHindi ? "शुद्ध जेब का मुनाफा (Net)" : "Net merchant takeaway"}
            </p>
          </div>
        </div>

        {/* Expandable Visual Graph Section */}
        {isGraphExpanded && (
          <div className="mt-2.5 rounded-2xl bg-sand/30 p-3 ring-1 ring-line animate-fade-in">
            {/* Header & Graph Legends */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-line/60">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-rust" />
                <span className="text-xs font-bold text-ink">
                  {t.timelineTrends}
                </span>
                <span className="hidden sm:inline text-[11px] text-inksoft">
                  ({t.timelineTrendsSub})
                </span>
              </div>

              {/* Chart Legend Chips */}
              <div className="flex items-center gap-2.5 text-[10px] font-semibold text-inksoft">
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-slate-800" />
                  {t.metricSales}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-amber-500" />
                  {t.metricExpenses}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-rose-500" />
                  {t.metricLoss}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-emerald" />
                  {t.metricProfit}
                </span>
              </div>
            </div>

            {/* Visual Comparative Bar Chart */}
            <div className="mt-3">
              <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 items-end h-32 sm:h-36 pt-4 pb-1 border-b border-line/70">
                {currentData.chartData.map((item, idx) => {
                  const isSelected = activeIntervalIndex === idx;
                  const label = isHindi ? item.labelHi : item.labelEn;

                  // Bar heights proportional to maxSales
                  const salesHeightPct = Math.max(12, Math.round((item.sales / maxSales) * 100));
                  const expenseHeightPct = Math.max(8, Math.round((item.expenses / maxSales) * 100));
                  const lossHeightPct = Math.max(4, Math.round(((item.loss * 4) / maxSales) * 100)); // amplified slightly for visual visibility
                  const profitHeightPct = Math.max(6, Math.round((item.profit / maxSales) * 100));

                  return (
                    <div
                      key={label}
                      onMouseEnter={() => setActiveIntervalIndex(idx)}
                      onClick={() => setActiveIntervalIndex(idx)}
                      className={cn(
                        "group relative flex flex-col items-center justify-end h-full cursor-pointer rounded-lg p-1 transition-all",
                        isSelected ? "bg-sand/80 ring-1 ring-rust/40" : "hover:bg-sand/40"
                      )}
                    >
                      {/* Interactive Tooltip on Hover/Tap */}
                      {isSelected && (
                        <div className="absolute -top-11 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-cream shadow-xl ring-1 ring-slate-700 animate-fade-in pointer-events-none">
                          <p className="font-bold text-amber-300">{label}</p>
                          <p>
                            {isHindi ? "बिक्री:" : "Sales:"} ₹{item.sales.toLocaleString("en-IN")} ·{" "}
                            {isHindi ? "मुनाफा:" : "Profit:"}{" "}
                            <span className="text-emerald-400 font-bold">
                              +₹{item.profit.toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Multi-Track Bars (Sales | Expense | Loss | Profit) */}
                      <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full h-full">
                        {/* Sales Bar */}
                        <div
                          style={{ height: `${salesHeightPct}%` }}
                          className="w-2 sm:w-3.5 rounded-t-sm bg-slate-800 transition-all duration-300 group-hover:brightness-110"
                          title={`${t.metricSales}: ₹${item.sales}`}
                        />
                        {/* Expense Bar */}
                        <div
                          style={{ height: `${expenseHeightPct}%` }}
                          className="w-2 sm:w-3 rounded-t-sm bg-amber-500 transition-all duration-300 group-hover:brightness-110"
                          title={`${t.metricExpenses}: ₹${item.expenses}`}
                        />
                        {/* Loss Bar */}
                        <div
                          style={{ height: `${lossHeightPct}%` }}
                          className="w-1.5 sm:w-2 rounded-t-sm bg-rose-500 transition-all duration-300 group-hover:brightness-110"
                          title={`${t.metricLoss}: ₹${item.loss}`}
                        />
                        {/* Profit Bar */}
                        <div
                          style={{ height: `${profitHeightPct}%` }}
                          className="w-2 sm:w-3 rounded-t-sm bg-emerald transition-all duration-300 group-hover:brightness-110"
                          title={`${t.metricProfit}: ₹${item.profit}`}
                        />
                      </div>

                      {/* Label under bar */}
                      <span
                        className={cn(
                          "mt-1.5 text-[10px] sm:text-[11px] font-medium truncate max-w-[70px] text-center",
                          isSelected ? "font-bold text-rust" : "text-inksoft"
                        )}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Allocation Split Bar (Kirana Formula: 100% = Expenses + Spoilage + Profit) */}
            <div className="mt-3 pt-2.5 border-t border-line/60">
              <div className="flex items-center justify-between text-[11px] font-semibold text-ink mb-1.5">
                <span className="flex items-center gap-1">
                  <Info className="size-3.5 text-rust" />
                  {t.revenueBreakdown}
                </span>
                <span className="text-[10px] text-inksoft">
                  {isHindi
                    ? "गल्ला (100%) = माल/खर्च + नुकसान + शुद्ध बचत"
                    : "Revenue (100%) = Expenses + Loss + Net Profit"}
                </span>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="h-3 sm:h-3.5 w-full rounded-full overflow-hidden flex ring-1 ring-line/80 shadow-inner bg-sand">
                <div
                  style={{ width: `${expensePct}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`${t.metricExpenses}: ${expensePct}%`}
                />
                <div
                  style={{ width: `${lossPct}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`${t.metricLoss}: ${lossPct}%`}
                />
                <div
                  style={{ width: `${profitPct}%` }}
                  className="bg-emerald h-full transition-all"
                  title={`${t.metricProfit}: ${profitPct}%`}
                />
              </div>

              {/* Split Legend Sub-text */}
              <div className="mt-1.5 flex flex-wrap items-center justify-between text-[10px] text-inksoft">
                <span className="text-amber-800 font-medium">
                  {t.metricExpenses}: {formatCurrency(currentData.expenses)} ({expensePct}%)
                </span>
                <span className="text-rose-700 font-medium">
                  {t.metricLoss}: {formatCurrency(currentData.loss)} ({lossPct}%)
                </span>
                <span className="text-emerald font-bold">
                  {t.metricProfit}: +{formatCurrency(currentData.netProfit)} ({profitPct}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Itemized Expenses & Loss Details Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-paper p-5 sm:p-6 shadow-2xl ring-1 ring-line text-ink max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-rust/10 text-rust">
                  <FileText className="size-4" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {t.breakdownModalTitle}
                  </h3>
                  <p className="text-xs text-inksoft">{t.breakdownModalSub}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-full p-1.5 text-inksoft hover:bg-sand hover:text-ink transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Selected Period Badge */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-sand/60 px-3 py-2 text-xs font-semibold">
              <span className="text-inksoft">
                {isHindi ? "चुनी गई अवधि:" : "Selected Timeframe:"}
              </span>
              <span className="rounded-full bg-rust px-2.5 py-0.5 text-cream text-[11px]">
                {timeframes.find((t) => t.key === timeframe)?.label}
              </span>
            </div>

            {/* Expenses List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Receipt className="size-3.5 text-amber-700" />
                {t.metricExpenses} (Total: ₹{currentData.expenses.toLocaleString("en-IN")})
              </h4>
              <div className="space-y-1.5">
                {currentData.expenseBreakdown.map((item) => (
                  <div
                    key={item.categoryEn}
                    className="flex items-center justify-between rounded-xl bg-sand/40 p-2 text-xs ring-1 ring-line/60"
                  >
                    <span className="font-medium text-ink">
                      {isHindi ? item.categoryHi : item.categoryEn}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-amber-900">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="ml-1.5 text-[10px] text-inksoft">({item.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loss & Wastage List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <AlertTriangle className="size-3.5 text-rose-600" />
                {t.metricLoss} (Total: ₹{currentData.loss.toLocaleString("en-IN")})
              </h4>
              <div className="space-y-1.5">
                {currentData.lossBreakdown.map((item) => (
                  <div
                    key={item.reasonEn}
                    className="flex items-center justify-between rounded-xl bg-rose-50/50 p-2 text-xs ring-1 ring-rose-200/60"
                  >
                    <span className="font-medium text-ink">
                      {isHindi ? item.reasonHi : item.reasonEn}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-rose-900">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="ml-1.5 text-[10px] text-rose-700">({item.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Profit Summary */}
            <div className="mt-4 rounded-2xl bg-emerald/15 p-3.5 ring-1 ring-emerald/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald">
                  {t.metricProfit} ({isHindi ? "दुकानदार की शुद्ध बचत" : "Net Takeaway"})
                </span>
                <span className="font-display text-lg font-bold text-emerald">
                  +₹{currentData.netProfit.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-emerald/90">
                {isHindi
                  ? `कुल बिक्री का ${currentData.marginPercent}% शुद्ध मुनाफा बैंक खाते में सुरक्षित है।`
                  : `${currentData.marginPercent}% net margin securely retained after all inventory costs & losses.`}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDetailModalOpen(false)}
              className="mt-5 w-full rounded-full bg-rust py-2 text-center text-xs sm:text-sm font-bold text-cream shadow-sm hover:opacity-90 transition-opacity"
            >
              {isHindi ? "ठीक है, समझ गया" : "Done"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
