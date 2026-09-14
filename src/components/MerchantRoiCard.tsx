import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-context";
import {
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

interface InfoTooltipProps {
  text: string;
}

function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={text}
            className="inline-flex size-3.5 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-inksoft ring-1 ring-line/80 hover:bg-paper hover:text-ink transition-colors cursor-help shrink-0"
            title={text}
          >
            ?
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="z-50 max-w-xs rounded-lg bg-ink px-2.5 py-1.5 text-[11px] leading-snug text-cream shadow-md border border-line/20 font-normal"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
            <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald inline-flex items-center gap-1.5">
              <span>{isHindi ? "+₹18,400 कुल अतिरिक्त लाभ" : "+₹18,400 Unlocked Revenue"}</span>
              <InfoTooltip
                text={
                  isHindi
                    ? "14-दिन पुनः ऑर्डर अंतर (48 ऑर्डर) × औसत बिल ₹180 + स्टॉक-आउट बचत से गणना"
                    : "Calculated from 14-day reorder frequency delta (48 orders) × avg ticket size ₹180 + avoided stock-outs"
                }
              />
            </span>
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
              <TrendingUp className="size-3.5 text-emerald ml-1" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-emerald">
              ₹18,400
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-inksoft">
              <span>
                {isHindi
                  ? "लक्षित शाम के ऑफर्स के माध्यम से"
                  : "Driven by AI evening campaigns"}
              </span>
              <InfoTooltip
                text={
                  isHindi
                    ? "धीमे घंटों में 10% ऑफर से 48 पुनः ऑर्डर × ₹180 बास्केट साइज से गणना"
                    : "Calculated from 48 repeat orders via 10% slow-hour broadcasts × ₹180 avg basket size"
                }
              />
            </div>
          </div>

          {/* Pillar 2: Recovery Rate */}
          <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "उधार वसूली दर" : "Udhaar Recovery Rate"}
              </p>
              <span className="text-[11px] font-bold text-emerald ml-1">↑ +23%</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              84%
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-inksoft">
              <span>
                {isHindi
                  ? "84% बनाम 61% उद्योग आधार"
                  : "84% vs 61% industry baseline"}
              </span>
              <InfoTooltip
                text={
                  isHindi
                    ? "42 खातों से गणना: पेटीएम यूपीआई लिंक से 7 दिनों में 84% वसूली बनाम 61% बही-खाता आधार"
                    : "Calculated from 42 overdue accounts: 84% settled in 7 days via Paytm UPI links vs 61% paper baseline"
                }
              />
            </div>
          </div>

          {/* Pillar 3: Time Saved */}
          <div className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "समय की बचत" : "Time Saved"}
              </p>
              <Clock className="size-3.5 text-rust ml-1" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              14 {isHindi ? "घंटे" : "hrs"}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-inksoft">
              <span>
                {isHindi
                  ? "खाता बही व ऑर्डर ड्राफ्टिंग में"
                  : "In ledger math & distributor POs"}
              </span>
              <InfoTooltip
                text={
                  isHindi
                    ? "साउंडबॉक्स ईओडी मिलान (25 मिनट) + 1-क्लिक सप्लायर पीओ ड्राफ्टिंग (15 मिनट) से गणना"
                    : "Calculated from Soundbox EOD reconciliation (25m/day) + 1-click supplier PO drafting (15m/day)"
                }
              />
            </div>
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
