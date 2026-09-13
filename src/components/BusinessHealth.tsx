import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function BusinessHealth() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  return (
    <section className="mt-8 animate-settle">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-xl font-semibold text-ink">
          {t.healthTitle}
        </h2>
        <span className="text-xs text-inksoft">
          {t.healthSub}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Sales */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.sales}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-semibold text-emerald tabular-nums">
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
          <p className="text-xs text-inksoft">{t.customers}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-semibold text-emerald tabular-nums">
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
          <p className="text-xs text-inksoft">{t.inventory}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-semibold text-warning tabular-nums">
              {isHindi ? "3 आइटम" : "3 items"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-warning font-medium">
            {t.itemsNeedAttention}
          </p>
        </div>

        {/* Udhaar */}
        <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.udhaar}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-2xl font-semibold text-ink tabular-nums">
              ₹12,840
            </span>
          </div>
          <p className="mt-1 text-[11px] text-inksoft">
            {isHindi ? "₹2,800 अतिदेय" : "₹2,800 overdue"}
          </p>
        </div>
      </div>
    </section>
  );
}
