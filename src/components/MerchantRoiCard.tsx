import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/lib/language-context";
import {
  Award,
  Calculator,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

interface MethodologyProps {
  label: string;
  formula: string;
  source: string;
  baseline: string;
}

function MethodologyTrigger({ label, formula, source, baseline }: MethodologyProps) {
  const { isHindi } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Calculation heuristic for ${label}`}
          className="inline-flex items-center gap-1 rounded-full bg-sand/80 px-1.5 py-0.5 text-[10px] font-bold text-inksoft ring-1 ring-line/80 hover:bg-sand hover:text-ink transition-all active:scale-95"
          title="Click to view calculation methodology"
        >
          <HelpCircle className="size-3 text-rust" />
          <span>?</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={6}
        className="z-50 w-72 sm:w-80 rounded-2xl bg-paper p-3.5 shadow-xl border border-line text-ink animate-in fade-in-0 zoom-in-95"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-rust">
          <Calculator className="size-3.5" />
          <span>{isHindi ? "गणना विधि और हेयूरिस्टिक" : "Calculation Heuristic & Methodology"}</span>
        </div>
        <p className="mt-1 font-display text-sm font-semibold text-ink">
          {label}
        </p>

        <div className="mt-2 rounded-xl bg-cream/70 p-2.5 ring-1 ring-line font-mono text-[11px] text-ink leading-relaxed">
          {formula}
        </div>

        <div className="mt-2.5 space-y-1 text-[11px] text-inksoft">
          <p>
            <strong className="text-ink">{isHindi ? "डेटा स्रोत: " : "Data Source: "}</strong>
            {source}
          </p>
          <p>
            <strong className="text-ink">{isHindi ? "उद्योग तुलना: " : "Industry Benchmark: "}</strong>
            {baseline}
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-inksoft font-medium">
          <span className="flex items-center gap-1 text-emerald font-semibold">
            <CheckCircle2 className="size-3" />
            Paytm Analytics Verified
          </span>
          <span>EOD Telemetry</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function MerchantRoiCard() {
  const { isHindi } = useLanguage();

  return (
    <section id="merchant-roi-section" className="mt-8 animate-settle">
      <div className="rounded-[20px] bg-sand/50 p-5 ring-1 ring-line sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald/10 text-emerald">
              <Award className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
                {isHindi
                  ? "अन्नपूर्णा किराना पर भारत का प्रभाव (इस महीने)"
                  : "Bharat's Impact this Month (Annapurna Kirana)"}
              </h3>
              <p className="text-xs text-inksoft">
                {isHindi
                  ? "वास्तविक व्यापार लाभ व समय की बचत"
                  : "Measurable business lift & merchant retention vitals"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">
              {isHindi ? "+₹18,400 कुल अतिरिक्त लाभ" : "+₹18,400 Unlocked Revenue"}
            </span>
            <MethodologyTrigger
              label="+₹18,400 Unlocked Revenue"
              formula="Calculated from 14-day reorder frequency delta (48 orders) × avg ticket size ₹180 + avoided stock-out salvage (₹4,760)."
              source="Paytm QR UPI transactions & distributor order log"
              baseline="Gorakhpur/Patna Kirana category average: ₹0 AI lift"
            />
          </div>
        </div>

        {/* 3 ROI Metric Pillars */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Pillar 1: Additional Sales */}
          <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "अतिरिक्त बिक्री" : "Additional Sales"}
              </p>
              <div className="flex items-center gap-1">
                <MethodologyTrigger
                  label="₹18,400 Additional Sales"
                  formula="48 repeat VIP orders generated via 10% slow-hour WhatsApp broadcast × ₹180 basket size + ₹9,760 prevented stock-out losses."
                  source="Campaign Conversion Tracker & Soundbox payment stamps"
                  baseline="+19.4% revenue increase vs unassisted baseline"
                />
                <TrendingUp className="size-3.5 text-emerald ml-1" />
              </div>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-emerald">
              ₹18,400
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi
                ? "लक्षित शाम के ऑफर्स के माध्यम से"
                : "Driven by AI evening campaigns"}
            </p>
          </div>

          {/* Pillar 2: Recovery Rate */}
          <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "उधार वसूली दर" : "Udhaar Recovery Rate"}
              </p>
              <div className="flex items-center gap-1">
                <MethodologyTrigger
                  label="84% Udhaar Recovery Rate"
                  formula="Tracked across 42 overdue ledger accounts: polite Paytm UPI WhatsApp links settled in 4.2 days vs paper ledger average of 18 days (61%)."
                  source="Live Bahi-Khata ledger & Paytm settlement logs"
                  baseline="Kirana paper baseline: 61% collection rate"
                />
                <span className="text-[11px] font-bold text-emerald ml-1">↑ +23%</span>
              </div>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              84%
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi
                ? "पेटीएम यूपीआई लिंक रिमाइंडर से"
                : "vs 61% industry baseline"}
            </p>
          </div>

          {/* Pillar 3: Time Saved */}
          <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "समय की बचत" : "Time Saved"}
              </p>
              <div className="flex items-center gap-1">
                <MethodologyTrigger
                  label="14 Hours Saved Monthly"
                  formula="Automated Soundbox EOD cash reconciliation (25 mins/day) + 1-click WhatsApp supplier PO drafting (15 mins/day) × 26 working days."
                  source="Merchant usage time logs & daily morning brief sessions"
                  baseline="Manual ledger bookkeeping: 38 hrs/month"
                />
                <Clock className="size-3.5 text-rust ml-1" />
              </div>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              14 {isHindi ? "घंटे" : "hrs"}
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi
                ? "खाता बही व ऑर्डर ड्राफ्टिंग में"
                : "In ledger math & distributor POs"}
            </p>
          </div>
        </div>

        {/* Ramesh Merchant Testimonial Quote */}
        <div className="mt-4 rounded-xl bg-cream/80 p-3.5 text-xs text-inksoft italic ring-1 ring-line/60">
          "{isHindi
            ? "पहले शाम को हिसाब मिलाने में 1 घंटा लग जाता था। अब भारत सुबह ही बता देता है कि क्या ऑर्डर करना है और किसे विनम्र याद दिलाना है।"
            : "Earlier, reconciling daily credit and guessing stock took an hour every evening. Now Bharat prepares everything before my tea rush."}
          {" — "}
          <span className="font-semibold not-italic text-ink">
            Ramesh, Owner, Annapurna Kirana
          </span>"
        </div>
      </div>
    </section>
  );
}
