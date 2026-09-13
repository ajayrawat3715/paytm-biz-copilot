import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKiranaData } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { udhaarAIData, type OverdueCustomer } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { DynamicUpiQr } from "@/components/DynamicUpiQr";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  QrCode,
  Send,
} from "lucide-react";

interface UdhaarAISectionProps {
  onSuccessReminder?: (msg: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const HINDI_BUCKET_LABELS: Record<string, string> = {
  "Likely to pay": "समय पर देने वाले",
  Overdue: "तय समय से लेट",
  "High attention": "अति ध्यान दें",
};

const HINDI_BUCKET_DESCRIPTIONS: Record<string, string> = {
  "Consistent payers, active grace period": "नियमित भुगतान करने वाले, छूट अवधि सक्रिय",
  "Past scheduled date by 1-4 days": "तय तारीख से 1-4 दिन अधिक",
  "Overdue 5-14 days — needs gentle follow-up": "5-14 दिन लेट — विनम्र फॉलो-अप आवश्यक",
};

export function UdhaarAISection({
  onSuccessReminder,
  isOpenExternal,
  onCloseExternal,
}: UdhaarAISectionProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];
  const { customers, totals, sendCustomerReminder } = useKiranaData();

  const [modalOpen, setModalOpen] = useState(false);
  const [sendingState, setSendingState] = useState<"idle" | "sending" | "sent">("idle");
  const [selectedCustomer, setSelectedCustomer] = useState<OverdueCustomer | null>(null);
  const [qrOpenId, setQrOpenId] = useState<string | null>(null);

  const isModalVisible = isOpenExternal !== undefined ? isOpenExternal : modalOpen;
  const setModalVisible = (open: boolean) => {
    if (onCloseExternal && !open) {
      onCloseExternal();
    }
    setModalOpen(open);
  };

  const handleSendAll = () => {
    setSendingState("sending");
    customers.forEach((c) => {
      if (c.status === "overdue") {
        sendCustomerReminder(c.id);
      }
    });
    setTimeout(() => {
      setSendingState("sent");
      if (onSuccessReminder) {
        onSuccessReminder(
          isHindi
            ? `${totals.overdueCount || 5} ग्राहकों को व्हाट्सएप पर पेटीएम यूपीआई लिंक के साथ रिमाइंडर भेज दिया गया।`
            : `${totals.overdueCount || 5} friendly reminders queued via WhatsApp with Paytm UPI links.`,
        );
      }
    }, 600);
  };

  const handleReset = () => {
    setSendingState("idle");
    setSelectedCustomer(null);
    setModalVisible(false);
  };

  return (
    <section className="mt-8 animate-settle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-sans text-xl font-semibold text-ink">
            {t.udhaarTitle}
          </h2>
          <p className="text-xs text-inksoft">
            {t.udhaarSub}
          </p>
        </div>
        <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-ink tabular-nums">
          {isHindi ? "कुल बकाया" : "Total"} ₹{totals.outstanding.toLocaleString("en-IN")}{" "}
          {isHindi ? "पेंडिंग" : "pending"}
        </span>
      </div>

      {/* 3 Top Figures */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.totalPending}</p>
          <p className="mt-1 font-sans text-[32px] sm:text-[36px] font-semibold leading-none text-ink tabular-nums">
            ₹{totals.outstanding.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-inksoft">
            {isHindi ? `${totals.openCount || 9} ग्राहकों पर सक्रिय दुकान उधार` : `Active shop credit across ${totals.openCount || 9} customers`}
          </p>
        </div>

        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.dueToday}</p>
          <p className="mt-1 font-sans text-[32px] sm:text-[36px] font-semibold leading-none text-ink tabular-nums">
            ₹{udhaarAIData.dueToday.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-emerald font-medium">
            {isHindi ? "2 नियमित ग्राहकों का आज देय" : "2 regular customers scheduled today"}
          </p>
        </div>

        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-xs text-inksoft">{t.overdue}</p>
          <p className="mt-1 font-sans text-[32px] sm:text-[36px] font-semibold leading-none text-rust tabular-nums">
            ₹{totals.overdueAmount.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-rust font-medium">
            {isHindi ? `${totals.overdueCount} ग्राहक तय समय से लेट` : `${totals.overdueCount} customers past promised date`}
          </p>
        </div>
      </div>

      {/* Risk Categorization Buckets */}
      <div className="mt-4 rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-inksoft">
          {t.riskSegmentation}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {udhaarAIData.buckets.map((bucket) => {
            const label = isHindi
              ? HINDI_BUCKET_LABELS[bucket.label] || bucket.label
              : bucket.label;
            const desc = isHindi
              ? HINDI_BUCKET_DESCRIPTIONS[bucket.description] || bucket.description
              : bucket.description;

            return (
              <div
                key={bucket.label}
                className={cn(
                  "rounded-xl p-4 ring-1 shadow-2xs",
                  bucket.tone === "emerald"
                    ? "bg-emerald-light/40 ring-emerald/30"
                    : bucket.tone === "amber"
                    ? "bg-warning-light/40 ring-warning/30"
                    : "bg-rust-light/40 ring-rust/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      bucket.tone === "emerald"
                        ? "text-emerald"
                        : bucket.tone === "amber"
                        ? "text-warning"
                        : "text-rust",
                    )}
                  >
                    {label}
                  </p>
                  <span className="text-[11px] text-inksoft tabular-nums font-medium">
                    {bucket.count} {isHindi ? "ग्राहक" : "customers"}
                  </span>
                </div>
                <p className="mt-2 font-sans text-2xl font-semibold text-ink tabular-nums">
                  ₹{bucket.amount.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] text-inksoft leading-relaxed">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bharat AI Recommendation Banner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-rust-light/35 p-4 ring-1 ring-rust/30">
          <div className="flex items-start gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-rust text-xs font-bold text-cream">
              भ
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">
                {t.bharatRecommendation}
              </p>
              <p className="mt-0.5 text-xs text-inksoft leading-relaxed">
                {isHindi
                  ? `"5 ग्राहकों पर ₹2,800 का उधार बकाया है। आज एक विनम्र रिमाइंडर भेजने की सलाह है।"`
                  : `"${udhaarAIData.recommendation}"`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalVisible(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rust px-4 py-2 text-xs font-semibold text-cream shadow-2xs ring-1 ring-rust/40 hover:bg-rust/95 active:scale-[0.98] transition-all"
          >
            {t.reviewReminders}
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Reminder Preview Modal */}
      <Dialog open={isModalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="border-line bg-paper sm:max-w-[560px]">
          {sendingState !== "sent" ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-rust/10 text-rust">
                    <MessageSquare className="size-4" />
                  </span>
                  <div>
                    <DialogTitle className="font-display text-xl font-semibold text-ink">
                      {isHindi ? "अतिदेय उधार रिमाइंडर पूर्वावलोकन" : "Overdue Udhaar Reminders"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-inksoft">
                      {isHindi
                        ? "पेटीएम यूपीआई भुगतान लिंक के साथ 5 विनम्र व्हाट्सएप संदेश"
                        : "5 polite WhatsApp messages with embedded Paytm UPI payment links"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-3 max-h-[340px] space-y-2.5 overflow-y-auto pr-1">
                {udhaarAIData.overdueCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl bg-cream/70 p-3.5 ring-1 ring-line"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-sm font-semibold text-ink">
                            {c.name}
                          </p>
                          <span className="text-[11px] text-inksoft">
                            ({c.phone})
                          </span>
                        </div>
                        <p className="text-[11px] text-inksoft">
                          {c.items} ·{" "}
                          <span className="text-rust font-medium">
                            {c.daysLate} {isHindi ? "दिन लेट" : "days late"}
                          </span>
                        </p>
                      </div>
                      <p className="font-display text-base font-semibold text-rust">
                        ₹{c.amount}
                      </p>
                    </div>

                    {/* Action row: WhatsApp link + Scannable Paytm QR Code Toggle */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <a
                        href={`https://wa.me/91${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(c.hindiMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        <span>{isHindi ? "व्हाट्सएप पर खोलें" : "Open in WhatsApp"}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setQrOpenId(qrOpenId === c.id ? null : c.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink ring-1 ring-line hover:bg-paper active:scale-95"
                      >
                        <QrCode className="size-3 text-[#002e6e]" />
                        <span>{qrOpenId === c.id ? (isHindi ? "QR छिपाएं" : "Hide QR") : (isHindi ? "पेटीएम क्यूआर कोड" : "Paytm UPI QR")}</span>
                      </button>
                    </div>

                    {/* Scannable Paytm UPI QR Code View */}
                    {qrOpenId === c.id && (
                      <div className="mt-3 flex justify-center animate-settle">
                        <DynamicUpiQr amount={c.amount} customerName={c.name} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <DialogFooter className="mt-4 flex-row items-center justify-between gap-2 border-t border-line pt-3 sm:justify-between">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>

                <button
                  type="button"
                  disabled={sendingState === "sending"}
                  onClick={handleSendAll}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rust px-5 py-2.5 text-xs font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  {sendingState === "sending"
                    ? isHindi
                      ? "भेजा जा रहा है..."
                      : "Sending reminders..."
                    : isHindi
                    ? "सभी 5 रिमाइंडर भेजें (डेमो)"
                    : "Send all 5 reminders (Demo)"}
                </button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center animate-settle">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/5">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                {isHindi ? "रिमाइंडर सफलतापूर्वक भेजे गए" : "Reminders sent"}
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald">
                {isHindi
                  ? "5 ग्राहकों को व्हाट्सएप पर संदेश प्राप्त हो गया है।"
                  : "5 customers received friendly reminders on WhatsApp."}
              </p>
              <p className="mx-auto mt-2 max-w-[40ch] text-xs text-inksoft leading-relaxed">
                {isHindi
                  ? "1-क्लिक पेटीएम यूपीआई लिंक शामिल है। 24 घंटे में संभावित वसूली: ₹2,800।"
                  : "Includes instant 1-tap Paytm UPI payment links. Expected recovery within 24 hours: ₹2,800."}
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-cream hover:bg-ink/90 active:scale-[0.98]"
                >
                  {isHindi ? "संपन्न" : "Done"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
