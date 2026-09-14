import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKiranaData, type CustomerRecord } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { udhaarAIData } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { DynamicUpiQr } from "@/components/DynamicUpiQr";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  QrCode,
  RotateCcw,
  Send,
  Sparkles,
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
  const {
    customers,
    totals,
    sendCustomerReminder,
    recordCustomerRepayment,
    sendAllOverdueReminders,
    resetToDefault,
  } = useKiranaData();

  const [modalOpen, setModalOpen] = useState(false);
  const [sendingState, setSendingState] = useState<"idle" | "sending" | "sent">("idle");
  const [qrOpenId, setQrOpenId] = useState<string | null>(null);
  const [lastSentMsg, setLastSentMsg] = useState<string | null>(null);

  const isModalVisible = isOpenExternal !== undefined ? isOpenExternal : modalOpen;
  const setModalVisible = (open: boolean) => {
    if (onCloseExternal && !open) {
      onCloseExternal();
    }
    setModalOpen(open);
  };

  // Pull actual customers with overdue history from state
  const targetCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.status === "overdue" ||
        (c.daysOverdue > 0 && (c.balance > 0 || c.reminded)) ||
        ["cust-1", "cust-2", "cust-3", "cust-4", "cust-5"].includes(c.id),
    );
  }, [customers]);

  const activeOverdueCusts = targetCustomers.filter((c) => c.balance > 0);
  const activeOverdueAmount = activeOverdueCusts.reduce((sum, c) => sum + c.balance, 0);

  // Send single customer reminder with optimistic Paytm UPI recovery
  const handleSendSingle = (c: CustomerRecord) => {
    const amt = c.balance;
    // Optimistic repayment update via Paytm QR / UPI
    recordCustomerRepayment(c.id, amt, "paytm_qr");

    const toastMsg = isHindi
      ? `✓ Reminder sent via Paytm UPI link to ${c.name} (₹${amt.toLocaleString("en-IN")})`
      : `✓ Reminder sent via Paytm UPI link to ${c.name} (₹${amt.toLocaleString("en-IN")})`;

    toast.success(toastMsg, {
      description: isHindi
        ? `₹${amt.toLocaleString("en-IN")} काउंटर कलेक्शन में तुरंत दर्ज हो गया।`
        : `₹${amt.toLocaleString("en-IN")} received via Paytm UPI link and added to counter cash.`,
    });

    setLastSentMsg(toastMsg);
    setTimeout(() => setLastSentMsg(null), 4500);

    if (onSuccessReminder && activeOverdueCusts.length <= 1) {
      onSuccessReminder(
        isHindi
          ? `${c.name} का उधार पेटीएम यूपीआई द्वारा प्राप्त हुआ।`
          : `Udhaar reminder sent via Paytm UPI link. Recovered ₹${amt}.`,
      );
    }
  };

  // Send all overdue reminders with optimistic Paytm UPI recovery
  const handleSendAll = () => {
    setSendingState("sending");
    const { count, totalAmount } = sendAllOverdueReminders(true);

    setTimeout(() => {
      setSendingState("sent");
      const toastMsg = isHindi
        ? `✓ Reminder sent via Paytm UPI link to ${count} customers (₹${totalAmount.toLocaleString("en-IN")} प्राप्त)`
        : `✓ Reminder sent via Paytm UPI link to ${count} customers (₹${totalAmount.toLocaleString("en-IN")} recovered)`;

      toast.success(toastMsg, {
        description: isHindi
          ? "सभी 5 ग्राहकों को 1-क्लिक पेटीएम यूपीआई लिंक भेज दिया गया है।"
          : "All overdue customer balances cleared via instant Paytm UPI links.",
      });

      setLastSentMsg(toastMsg);

      if (onSuccessReminder) {
        onSuccessReminder(
          isHindi
            ? `5 ग्राहकों को पेटीएम यूपीआई लिंक भेजा गया। ₹${totalAmount.toLocaleString("en-IN")} की वसूली संपन्न!`
            : `Friendly reminders sent via Paytm UPI link. ₹${totalAmount.toLocaleString("en-IN")} recovered into live balance.`,
        );
      }
    }, 500);
  };

  const handleReset = () => {
    setSendingState("idle");
    setModalVisible(false);
  };

  return (
    <section className="mt-8 animate-settle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            {t.udhaarTitle}
          </h2>
          <p className="text-xs text-inksoft">{t.udhaarSub}</p>
        </div>
        <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-ink">
          {isHindi ? "कुल बकाया" : "Total"} ₹{totals.outstanding.toLocaleString("en-IN")}{" "}
          {isHindi ? "पेंडिंग" : "pending"}
        </span>
      </div>

      {/* 3 Top Figures Connected Directly to Context */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-xs text-inksoft">{t.totalPending}</p>
          <p className="mt-1 font-display text-[32px] font-semibold leading-none text-ink">
            ₹{totals.outstanding.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-inksoft">
            {isHindi
              ? `${totals.openCount || 0} ग्राहकों पर सक्रिय दुकान उधार`
              : `Active shop credit across ${totals.openCount || 0} customers`}
          </p>
        </div>

        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-xs text-inksoft">{t.dueToday}</p>
          <p className="mt-1 font-display text-[32px] font-semibold leading-none text-ink">
            ₹{udhaarAIData.dueToday.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-xs text-emerald font-medium">
            {isHindi ? "2 नियमित ग्राहकों का आज देय" : "2 regular customers scheduled today"}
          </p>
        </div>

        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-xs text-inksoft">{t.overdue}</p>
          <p
            className={cn(
              "mt-1 font-display text-[32px] font-semibold leading-none transition-colors",
              totals.overdueAmount === 0 ? "text-emerald" : "text-rust",
            )}
          >
            ₹{totals.overdueAmount.toLocaleString("en-IN")}
          </p>
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              totals.overdueAmount === 0 ? "text-emerald" : "text-rust",
            )}
          >
            {totals.overdueAmount === 0
              ? isHindi
                ? "✓ सभी पुराने उधार वसूल हो चुके हैं!"
                : "✓ 0 overdue customers remaining!"
              : isHindi
              ? `${totals.overdueCount} ग्राहक तय समय से लेट`
              : `${totals.overdueCount} customers past promised date`}
          </p>
        </div>
      </div>

      {/* Risk Categorization Buckets */}
      <div className="mt-4 rounded-[20px] bg-paper p-5 ring-1 ring-line sm:p-6">
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

            // Live adjust overdue bucket if settled
            const isOverdueBucket = bucket.label.toLowerCase().includes("overdue");
            const displayAmt = isOverdueBucket ? totals.overdueAmount : bucket.amount;
            const displayCount = isOverdueBucket ? totals.overdueCount : bucket.count;

            return (
              <div
                key={bucket.label}
                className={cn(
                  "rounded-xl p-4 ring-1 transition-all",
                  bucket.tone === "emerald"
                    ? "bg-emerald/5 ring-emerald/20"
                    : bucket.tone === "amber"
                    ? "bg-amber-500/5 ring-amber-500/20"
                    : isOverdueBucket && totals.overdueAmount === 0
                    ? "bg-emerald/5 ring-emerald/20"
                    : "bg-rust/5 ring-rust/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      bucket.tone === "emerald"
                        ? "text-emerald"
                        : bucket.tone === "amber"
                        ? "text-amber-800"
                        : isOverdueBucket && totals.overdueAmount === 0
                        ? "text-emerald"
                        : "text-rust",
                    )}
                  >
                    {isOverdueBucket && totals.overdueAmount === 0
                      ? isHindi
                        ? "✓ पूर्ण वसूली"
                        : "✓ Cleared"
                      : label}
                  </p>
                  <span className="text-[11px] text-inksoft">
                    {displayCount} {isHindi ? "ग्राहक" : "customers"}
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  ₹{displayAmt.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] text-inksoft leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bharat AI Recommendation Banner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-cream p-4 ring-1 ring-line">
          <div className="flex items-start gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-cream">
              भ
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">
                {t.bharatRecommendation}
              </p>
              <p className="mt-0.5 text-xs text-inksoft leading-relaxed">
                {totals.overdueAmount === 0
                  ? isHindi
                    ? "✓ सभी 5 अतिदेय उधार सफलतापूर्वक वसूल हो गए हैं। काउंटर बैलेंस अपडेट हो गया है।"
                    : "✓ All overdue udhaar has been settled via Paytm UPI. Ledger is up to date."
                  : isHindi
                  ? `"${totals.overdueCount} ग्राहकों पर ₹${totals.overdueAmount.toLocaleString("en-IN")} का उधार बकाया है। आज एक विनम्र रिमाइंडर भेजने की सलाह है।"`
                  : `"${totals.overdueCount} customers have ₹${totals.overdueAmount.toLocaleString("en-IN")} overdue. Recommended action: Send polite WhatsApp reminders with 1-tap Paytm UPI links."`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalVisible(true)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]",
              totals.overdueAmount === 0
                ? "bg-emerald text-white hover:bg-emerald/90"
                : "bg-rust text-cream ring-1 ring-rust/40 hover:opacity-95",
            )}
          >
            <span>
              {totals.overdueAmount === 0
                ? isHindi
                  ? "✓ वसूली स्थिति देखें"
                  : "✓ View Recovery Status"
                : t.reviewReminders}
            </span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Real-time Overdue Udhaar Reminders Modal */}
      <Dialog open={isModalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="border-line bg-paper sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          {sendingState !== "sent" ? (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2 pr-4">
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
                          ? "पेटीएम यूपीआई भुगतान लिंक के साथ विनम्र व्हाट्सएप संदेश"
                          : "Polite WhatsApp messages with embedded Paytm UPI payment links"}
                      </DialogDescription>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold shrink-0",
                      activeOverdueAmount === 0
                        ? "bg-emerald/15 text-emerald"
                        : "bg-rust/10 text-rust",
                    )}
                  >
                    ₹{activeOverdueAmount.toLocaleString("en-IN")}{" "}
                    {isHindi ? "बकाया" : "pending"}
                  </span>
                </div>
              </DialogHeader>

              {/* In-Dialog Toast Notification Banner */}
              {lastSentMsg && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 animate-settle">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>{lastSentMsg}</span>
                </div>
              )}

              {/* Live Customer List Pulled Directly From State */}
              <div className="mt-3 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                {targetCustomers.map((c) => {
                  const isSettled = c.balance === 0;
                  const originalAmt = c.id === "cust-1" ? 800 : c.id === "cust-2" ? 650 : c.id === "cust-3" ? 500 : c.id === "cust-4" ? 450 : 400;
                  const displayAmt = isSettled ? originalAmt : c.balance;

                  const whatsappMessage = isHindi
                    ? `नमस्ते ${c.name} जी, आशा है आप सकुशल हैं। आपकी ₹${displayAmt} की उधारी बकाया है। कृपया इस 1-क्लिक पेटीएम यूपीआई लिंक से भुगतान करें: upi://pay?pa=annapurna.kirana@paytm&pn=Annapurna+Kirana&am=${displayAmt}&cu=INR — धन्यवाद, अन्नपूर्णा किराना`
                    : `Hello ${c.name} ji, hope you are well. Gentle reminder of your ₹${displayAmt} grocery balance at Annapurna Kirana. Settle instantly via Paytm UPI: upi://pay?pa=annapurna.kirana@paytm&pn=Annapurna+Kirana&am=${displayAmt}&cu=INR — Thank you!`;

                  return (
                    <div
                      key={c.id}
                      className={cn(
                        "rounded-xl p-3.5 ring-1 transition-all",
                        isSettled
                          ? "bg-emerald/5 ring-emerald/30 border-l-4 border-l-emerald"
                          : "bg-cream/70 ring-line",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-display text-sm font-semibold text-ink">
                              {c.name}
                            </p>
                            <span className="text-[11px] text-inksoft">({c.phone})</span>

                            {isSettled ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2 py-0.2 text-[10px] font-bold text-emerald">
                                <CheckCircle2 className="size-3" />
                                {isHindi ? "पेटीएम UPI से प्राप्त" : "Settled via Paytm UPI"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-semibold text-amber-700">
                                <Clock className="size-3" />
                                {c.daysOverdue} {isHindi ? "दिन लेट" : "days late"}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-inksoft">
                            {c.items} · {c.totalVisits || 12} {isHindi ? "दुकान फेरे" : "visits"}
                          </p>
                        </div>

                        <div className="text-right">
                          {isSettled ? (
                            <div>
                              <p className="font-display text-sm line-through text-inksoft">
                                ₹{originalAmt}
                              </p>
                              <p className="font-display text-base font-bold text-emerald">
                                ₹0
                              </p>
                            </div>
                          ) : (
                            <p className="font-display text-base font-bold text-rust">
                              ₹{c.balance}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp message copy snippet */}
                      <div className="mt-2 rounded-lg bg-white/70 p-2 text-[11px] text-inksoft ring-1 ring-black/5 font-sans leading-relaxed">
                        <p className="line-clamp-2 italic">"{whatsappMessage}"</p>
                      </div>

                      {/* Action Row: Send Individual Reminder via Paytm UPI & QR Code */}
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/91${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                          >
                            <span>{isHindi ? "व्हाट्सएप खोलें" : "Open WhatsApp"}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setQrOpenId(qrOpenId === c.id ? null : c.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink ring-1 ring-line hover:bg-paper active:scale-95"
                          >
                            <QrCode className="size-3 text-[#002e6e]" />
                            <span>
                              {qrOpenId === c.id
                                ? isHindi
                                  ? "QR छिपाएं"
                                  : "Hide QR"
                                : isHindi
                                ? "पेटीएम क्यूआर"
                                : "Paytm UPI QR"}
                            </span>
                          </button>
                        </div>

                        <div>
                          {isSettled ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald">
                              <CheckCircle2 className="size-3.5" />
                              <span>{isHindi ? "✓ रिमाइंडर व राशि प्राप्त" : "✓ Paid via UPI Link"}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendSingle(c)}
                              className="inline-flex items-center gap-1 rounded-full bg-rust px-3 py-1.5 text-xs font-bold text-cream shadow-sm hover:bg-rust/90 active:scale-95 transition-all"
                            >
                              <Send className="size-3" />
                              <span>{isHindi ? "रिमाइंडर व UPI लिंक भेजें" : "Send Reminder (Paytm UPI)"}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dynamic Paytm UPI QR Code View */}
                      {qrOpenId === c.id && (
                        <div className="mt-3 flex justify-center animate-settle border-t border-line pt-2">
                          <DynamicUpiQr
                            amount={displayAmt}
                            customerName={c.name}
                            onClose={() => setQrOpenId(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="mt-4 flex-row items-center justify-between gap-2 border-t border-line pt-3 sm:justify-between">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
                >
                  {isHindi ? "बंद करें" : "Close"}
                </button>

                {activeOverdueCusts.length > 0 ? (
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
                      ? `सभी ${activeOverdueCusts.length} रिमाइंडर भेजें (₹${activeOverdueAmount.toLocaleString("en-IN")})`
                      : `Send all ${activeOverdueCusts.length} reminders via Paytm UPI`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetToDefault}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sand px-4 py-2 text-xs font-semibold text-ink ring-1 ring-line hover:bg-paper active:scale-95"
                  >
                    <RotateCcw className="size-3 text-rust" />
                    <span>{isHindi ? "डेमो डेटा रीसेट करें" : "Reset Demo Data"}</span>
                  </button>
                )}
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center animate-settle">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/5">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
                {isHindi ? "रिमाइंडर सफलतापूर्वक भेजे गए!" : "Reminders Sent via Paytm UPI Link!"}
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald">
                {isHindi
                  ? "5 ग्राहकों को व्हाट्सएप संदेश और 1-क्लिक यूपीआई लिंक प्राप्त हो गया है।"
                  : "5 customers received polite WhatsApp messages with 1-tap Paytm UPI links."}
              </p>
              <div className="mx-auto mt-4 max-w-sm rounded-xl bg-emerald/5 p-3.5 ring-1 ring-emerald/20 text-xs text-ink text-left space-y-1">
                <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  <span>{isHindi ? "पेटीएम मर्चेंट समाधान दर्ज" : "Paytm Merchant Impact Realized"}</span>
                </p>
                <p className="text-inksoft">
                  • <strong>{isHindi ? "वसूली राशि:" : "Recovered Cash:"}</strong> ₹2,800 {isHindi ? "काउंटर कलेक्शन में जुड़ा" : "credited to counter collections"}
                </p>
                <p className="text-inksoft">
                  • <strong>{isHindi ? "लंबित अतिदेय उधार:" : "Pending Overdue:"}</strong> ₹0 (0 {isHindi ? "ग्राहक" : "customers"})
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-cream hover:bg-ink/90 active:scale-[0.98]"
                >
                  {isHindi ? "डैशबोर्ड पर वापस जाएं" : "Return to Dashboard"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
