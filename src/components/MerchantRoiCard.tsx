import { useLanguage } from "@/lib/language-context";
import { ArrowUpRight, Award, CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";

export function MerchantRoiCard() {
  const { isHindi } = useLanguage();

  return (
    <section className="mt-8 animate-settle">
      <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-light text-emerald">
              <Award className="size-4" />
            </span>
            <div>
              <h3 className="font-sans text-base font-semibold text-ink sm:text-lg">
                {isHindi ? "अन्नपूर्णा किराना पर भारत का प्रभाव (इस महीने)" : "Bharat's Impact this Month (Annapurna Kirana)"}
              </h3>
              <p className="text-xs text-inksoft">
                {isHindi ? "वास्तविक व्यापार लाभ व समय की बचत" : "Measurable business lift & merchant retention vitals"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-light px-3 py-1 text-xs font-semibold text-emerald tabular-nums">
            {isHindi ? "+₹18,400 कुल अतिरिक्त लाभ" : "+₹18,400 Unlocked Revenue"}
          </span>
        </div>

        {/* 3 ROI Metric Pillars */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-sand/40 p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "अतिरिक्त बिक्री" : "Additional Sales"}
              </p>
              <TrendingUp className="size-3.5 text-emerald" />
            </div>
            <p className="mt-1 font-sans text-2xl font-semibold text-emerald tabular-nums">
              ₹18,400
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "लक्षित शाम के ऑफर्स के माध्यम से" : "Driven by AI evening campaigns"}
            </p>
          </div>

          <div className="rounded-xl bg-sand/40 p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "उधार वसूली दर" : "Udhaar Recovery Rate"}
              </p>
              <span className="text-[11px] font-semibold text-emerald">↑ +23%</span>
            </div>
            <p className="mt-1 font-sans text-2xl font-semibold text-ink tabular-nums">
              84%
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "पेटीएम यूपीआई लिंक रिमाइंडर से" : "vs 61% industry baseline"}
            </p>
          </div>

          <div className="rounded-xl bg-sand/40 p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <p className="text-xs text-inksoft">
                {isHindi ? "समय की बचत" : "Time Saved"}
              </p>
              <Clock className="size-3.5 text-rust" />
            </div>
            <p className="mt-1 font-sans text-2xl font-semibold text-ink tabular-nums">
              14 {isHindi ? "घंटे" : "hrs"}
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "खाता बही व ऑर्डर ड्राफ्टिंग में" : "In ledger math & distributor POs"}
            </p>
          </div>
        </div>

        {/* Ramesh Merchant Testimonial Quote */}
        <div className="mt-4 rounded-xl bg-cream/70 p-3.5 text-xs text-inksoft italic ring-1 ring-line/60">
          "{isHindi
            ? "पहले शाम को हिसाब मिलाने में 1 घंटा लग जाता था। अब भारत सुबह ही बता देता है कि क्या ऑर्डर करना है और किसे विनम्र याद दिलाना है।"
            : "Earlier, reconciling daily credit and guessing stock took an hour every evening. Now Bharat prepares everything before my tea rush."}
          {" — "}
          <span className="font-semibold not-italic text-ink">Ramesh, Owner, Annapurna Kirana</span>"
        </div>
      </div>
    </section>
  );
}
