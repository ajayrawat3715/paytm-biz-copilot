import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { CheckCircle2, AlertCircle, Activity, Sparkles } from "lucide-react";

export function BusinessHealth() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  return (
    <section className="mt-8 animate-settle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-emerald/10 text-emerald">
            <Activity className="size-3.5" />
          </span>
          <h2 className="font-sans text-[22px] sm:text-[24px] font-bold text-ink leading-[1.2] tracking-[-0.02em]">
            {t.healthTitle}
          </h2>
        </div>
        <span className="text-xs text-inksoft">{t.healthSub}</span>
      </div>

      {/* 82 / 100 Health Scorecard Banner */}
      <div className="mt-4 rounded-2xl bg-paper p-5 sm:p-6 ring-1 ring-line shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-4xl sm:text-5xl font-bold tabular-nums tracking-[-0.025em] text-ink">
                82
              </span>
              <span className="text-base font-semibold text-inksoft">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-light px-2.5 py-0.5 text-[11px] font-bold text-emerald">
                  <span className="size-1.5 rounded-full bg-emerald animate-tick" />
                  {isHindi ? "स्वस्थ संचालन स्कोर" : "Healthy Operational Score"}
                </span>
              </div>
              <p className="mt-1 text-xs text-inksoft">
                {isHindi
                  ? "7-दिवसीय लेन-देन, ग्राहक आवागमन और बही-खाता पर आधारित"
                  : "Based on 7-day payment velocity, customer repeat rate & ledger discipline"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-sand px-3 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">
            {isHindi ? "साप्ताहिक समीक्षा" : "Weekly Assessment"}
          </span>
        </div>

        {/* Transparent Breakdown: Strong Areas vs Needs Attention */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Strong Areas */}
          <div className="rounded-xl bg-emerald-light/35 p-3.5 ring-1 ring-emerald/25">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald">
              <CheckCircle2 className="size-3.5" />
              <span>{isHindi ? "मजबूत क्षेत्र (Strong Areas)" : "Strong Areas"}</span>
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-ink">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald shrink-0" />
                <span>
                  <strong>UPI collections</strong> (+12% vs last week, 126 txns)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald shrink-0" />
                <span>
                  <strong>Customer retention</strong> (+8% repeat footfall at counter)
                </span>
              </li>
            </ul>
          </div>

          {/* Needs Attention */}
          <div className="rounded-xl bg-warning-light/35 p-3.5 ring-1 ring-warning/25">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-warning">
              <AlertCircle className="size-3.5" />
              <span>{isHindi ? "ध्यान देने योग्य (Needs Attention)" : "Needs Attention"}</span>
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-ink">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-warning shrink-0" />
                <span>
                  <strong>Inventory</strong> (3 items low stock, Parle biscuits at 0)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-warning shrink-0" />
                <span>
                  <strong>Udhaar recovery</strong> (₹2,800 overdue across 5 customers)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Underlying Vitals Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Sales */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">{t.sales}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-bold text-emerald tabular-nums tracking-[-0.02em]">
              ↑ 8%
            </span>
            <span className="text-[11px] text-inksoft">
              {isHindi ? "पिछले हफ्ते से" : "vs last week"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-inksoft">
            {isHindi ? "सप्ताहांत गति मजबूत" : "Weekend pickup strong"}
          </p>
        </div>

        {/* Customers */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">{t.customers}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-bold text-emerald tabular-nums tracking-[-0.02em]">
              ↑ 12%
            </span>
            <span className="text-[11px] text-inksoft">
              {isHindi ? "दोहराव ग्राहक" : "repeat footfall"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-inksoft">
            {isHindi ? "यूपीआई से जुड़ाव बढ़ा" : "UPI loyalty growing"}
          </p>
        </div>

        {/* Inventory */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">{t.inventory}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-bold text-warning tabular-nums tracking-[-0.02em]">
              {isHindi ? "3 आइटम" : "3 items"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-warning font-semibold">
            {t.itemsNeedAttention}
          </p>
        </div>

        {/* Udhaar */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">{t.udhaar}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-bold text-ink tabular-nums tracking-[-0.02em]">
              ₹12,840
            </span>
          </div>
          <p className="mt-1 text-[11px] text-rust font-semibold">
            {isHindi ? "₹2,800 अतिदेय" : "₹2,800 overdue"}
          </p>
        </div>
      </div>
    </section>
  );
}
