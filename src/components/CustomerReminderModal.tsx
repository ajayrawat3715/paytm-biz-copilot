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
import { DynamicUpiQr } from "@/components/DynamicUpiQr";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  QrCode,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

export type CustomerModalMode = "udhaar" | "inactive";

interface CustomerReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: CustomerModalMode;
  onSuccess?: (summary: string) => void;
}

export function CustomerReminderModal({
  open,
  onOpenChange,
  mode = "udhaar",
  onSuccess,
}: CustomerReminderModalProps) {
  const { isHindi } = useLanguage();
  const {
    customers,
    totals,
    recordCustomerRepayment,
    sendAllOverdueReminders,
    launchCampaign,
  } = useKiranaData();

  const [activeQrId, setActiveQrId] = useState<string | null>(null);
  const [sentCustomerIds, setSentCustomerIds] = useState<Record<string, boolean>>({});

  // Filter customers based on mode
  const targetCustomers = useMemo(() => {
    if (mode === "inactive") {
      // Inactive / lapsed customers who need targeted 10% offer
      return customers.filter(
        (c) =>
          c.status === "inactive" ||
          c.riskLevel === "high" ||
          ["cust-1", "cust-2", "cust-3", "cust-8"].includes(c.id),
      );
    }

    // Overdue udhaar customers with pending balance
    return customers.filter(
      (c) =>
        c.status === "overdue" ||
        (c.daysOverdue > 0 && (c.balance > 0 || c.reminded)) ||
        ["cust-1", "cust-2", "cust-3", "cust-4", "cust-5"].includes(c.id),
    );
  }, [customers, mode]);

  const activeOverdueCusts = targetCustomers.filter((c) => c.balance > 0);
  const totalPendingAmount = activeOverdueCusts.reduce((sum, c) => sum + c.balance, 0);

  // Send single customer reminder with optimistic balance clearance
  const handleSendSingle = (c: CustomerRecord) => {
    const amt = c.balance > 0 ? c.balance : 500;

    // Optimistically update udhaar total and customer balance in state
    recordCustomerRepayment(c.id, amt, "paytm_qr");
    setSentCustomerIds((prev) => ({ ...prev, [c.id]: true }));

    // Show toast confirmation
    toast.success("Reminder sent via Paytm UPI link", {
      description: isHindi
        ? `${c.name} को रिमाइंडर भेजा गया। काउंटर कलेक्शन व उधार में अपडेट दर्ज!`
        : `Reminder sent to ${c.name}. Udhaar balance and counter cash updated.`,
    });

    if (onSuccess) {
      onSuccess(
        mode === "inactive"
          ? `Offer sent to ${c.name} via Paytm UPI link.`
          : `Reminder sent via Paytm UPI link to ${c.name} (₹${amt}).`,
      );
    }
  };

  // Send all reminders
  const handleSendAll = () => {
    if (mode === "inactive") {
      launchCampaign("lapsed-10");
    }

    // Clear all overdue balances in real time
    sendAllOverdueReminders(true);

    const updatedSent: Record<string, boolean> = {};
    targetCustomers.forEach((c) => {
      updatedSent[c.id] = true;
    });
    setSentCustomerIds(updatedSent);

    toast.success("Reminder sent via Paytm UPI link", {
      description: isHindi
        ? `सभी ग्राहकों को पेटीएम यूपीआई लिंक भेजा गया। ₹${totals.overdueAmount.toLocaleString("en-IN")} वसूल!`
        : `All reminders sent with 1-click Paytm UPI links. ₹${totalPendingAmount.toLocaleString("en-IN")} recovered.`,
    });

    if (onSuccess) {
      onSuccess(
        mode === "inactive"
          ? "10% offer sent to inactive customers via Paytm UPI links."
          : `5 overdue reminders sent via Paytm UPI link. Recovered ₹${totalPendingAmount}.`,
      );
    }

    setTimeout(() => {
      onOpenChange(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper sm:max-w-[580px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-rust/10 text-rust">
                {mode === "inactive" ? (
                  <Users className="size-4.5" />
                ) : (
                  <MessageSquare className="size-4.5" />
                )}
              </span>
              <div>
                <DialogTitle className="font-display text-xl font-bold text-ink">
                  {mode === "inactive"
                    ? isHindi
                      ? "निष्क्रिय ग्राहकों को ऑफर भेजें"
                      : "Inactive Customer Outreach"
                    : isHindi
                    ? "अतिदेय उधार रिमाइंडर सूची"
                    : "Overdue Udhaar Reminders"}
                </DialogTitle>
                <DialogDescription className="text-xs text-inksoft mt-0.5">
                  {mode === "inactive"
                    ? isHindi
                      ? "10% शाम का ऑफर और पेटीएम यूपीआई लिंक भेजकर ग्राहकों को वापस लाएं"
                      : "Send 10% evening offer with 1-click Paytm UPI link to bring back regulars"
                    : isHindi
                    ? "पेटीएम यूपीआई भुगतान लिंक के साथ विनम्र व्हाट्सएप संदेश"
                    : "Polite WhatsApp messages with 1-click Paytm UPI payment links"}
                </DialogDescription>
              </div>
            </div>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-bold shrink-0",
                totalPendingAmount === 0
                  ? "bg-emerald/15 text-emerald"
                  : "bg-rust/10 text-rust",
              )}
            >
              {mode === "inactive"
                ? "240 Inactive"
                : `₹${totalPendingAmount.toLocaleString("en-IN")} pending`}
            </span>
          </div>
        </DialogHeader>

        {/* Real Customer List Pulled from State */}
        <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {targetCustomers.map((c) => {
            const isSettled =
              mode === "inactive"
                ? Boolean(sentCustomerIds[c.id])
                : Boolean(c.balance === 0 || sentCustomerIds[c.id]);

            const originalAmt =
              c.id === "cust-1"
                ? 800
                : c.id === "cust-2"
                ? 650
                : c.id === "cust-3"
                ? 500
                : c.id === "cust-4"
                ? 450
                : c.id === "cust-8"
                ? 6100
                : 400;

            const displayAmt = c.balance > 0 ? c.balance : originalAmt;
            const isQrOpen = activeQrId === c.id;

            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-xl p-3.5 ring-1 transition-all",
                  isSettled
                    ? "bg-emerald/5 ring-emerald/30 border-l-4 border-l-emerald"
                    : "bg-cream/60 ring-line hover:bg-cream",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm font-bold text-ink">
                        {c.name}
                      </p>
                      <span className="text-[11px] font-mono text-inksoft">
                        ({c.phone})
                      </span>
                      {isSettled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2 py-0.2 text-[10px] font-bold text-emerald">
                          <CheckCircle2 className="size-3" />
                          {mode === "inactive"
                            ? isHindi
                              ? "ऑफर भेजा गया"
                              : "Offer Sent"
                            : isHindi
                            ? "पेटीएम UPI से प्राप्त"
                            : "Settled via Paytm UPI"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-semibold text-amber-800">
                          <Clock className="size-3" />
                          {c.daysOverdue > 0
                            ? `${c.daysOverdue} days late`
                            : mode === "inactive"
                            ? "Inactive 15+ days"
                            : "Due soon"}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-inksoft">
                      <strong className="text-ink font-medium">
                        {isHindi ? "सामान: " : "Items: "}
                      </strong>
                      {c.items || "Grocery essentials"}
                    </p>

                    <p className="mt-1 font-mono text-[11px] text-inksoft/80 italic">
                      "{mode === "inactive"
                        ? isHindi
                          ? `नमस्ते ${c.name} जी, अन्नपूर्णा किराना पर आज शाम 10% विशेष छूट! 1-क्लिक पेटीएम यूपीआई से ऑर्डर करें: upi://pay?pa=annapurna.kirana@paytm`
                          : `Hello ${c.name} ji, special 10% evening offer at Annapurna Kirana! Order & pay instantly via Paytm UPI: upi://pay?pa=annapurna.kirana@paytm`
                        : isHindi
                        ? `नमस्ते ${c.name} जी, आपकी ₹${displayAmt} उधारी बाकी है। 1-क्लिक पेटीएम यूपीआई से भरें: upi://pay?pa=annapurna.kirana@paytm`
                        : `Hello ${c.name} ji, kindly settle your ₹${displayAmt} grocery balance via Paytm UPI: upi://pay?pa=annapurna.kirana@paytm`}"
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        "font-display text-base font-bold",
                        isSettled && mode === "udhaar"
                          ? "text-emerald line-through opacity-70"
                          : "text-rust",
                      )}
                    >
                      {mode === "inactive" && c.id === "cust-8"
                        ? "+₹6,100 sales"
                        : `₹${displayAmt.toLocaleString("en-IN")}`}
                    </p>

                    {/* Action buttons */}
                    <div className="mt-2 flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveQrId(isQrOpen ? null : c.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-sand px-2 py-1 text-[10px] font-semibold text-ink ring-1 ring-line hover:bg-paper active:scale-95 transition-all"
                        title="View Paytm QR"
                      >
                        <QrCode className="size-3 text-[#002e6e]" />
                        <span>QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendSingle(c)}
                        disabled={isSettled}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all shadow-xs active:scale-95",
                          isSettled
                            ? "bg-emerald/20 text-emerald cursor-default"
                            : "bg-rust text-cream hover:bg-rust/90",
                        )}
                      >
                        {isSettled ? (
                          <>
                            <CheckCircle2 className="size-3" />
                            <span>{isHindi ? "भेजा गया" : "Sent"}</span>
                          </>
                        ) : (
                          <>
                            <Send className="size-3" />
                            <span>{isHindi ? "भेजें" : "Send"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scannable Paytm UPI QR dropdown */}
                {isQrOpen && (
                  <div className="mt-3 pt-3 border-t border-line/60 flex flex-col items-center justify-center p-2 rounded-xl bg-white ring-1 ring-line animate-settle">
                    <p className="text-xs font-bold text-[#002e6e] mb-1">
                      Paytm Merchant UPI QR · {c.name} (₹{displayAmt})
                    </p>
                    <DynamicUpiQr amount={displayAmt} customerName={c.name} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-5 border-t border-line pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-inksoft">
            {mode === "inactive"
              ? "✓ 240 inactive customer campaign ready"
              : totalPendingAmount === 0
              ? "✓ All customer balances cleared!"
              : `Total pending: ₹${totalPendingAmount.toLocaleString("en-IN")}`}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-initial rounded-xl px-4 py-2 text-xs font-semibold text-ink ring-1 ring-line hover:bg-sand transition-all"
            >
              {isHindi ? "बंद करें" : "Close"}
            </button>

            <button
              type="button"
              onClick={handleSendAll}
              disabled={mode === "udhaar" && totalPendingAmount === 0}
              className={cn(
                "flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-sm transition-all active:scale-95",
                mode === "udhaar" && totalPendingAmount === 0
                  ? "bg-emerald text-white cursor-default"
                  : "bg-[#002e6e] text-white hover:bg-[#002252]",
              )}
            >
              <Send className="size-3.5" />
              <span>
                {mode === "inactive"
                  ? isHindi
                    ? "सभी को 10% ऑफर भेजें"
                    : "Send 10% Offer to All via Paytm UPI"
                  : totalPendingAmount === 0
                  ? "✓ All Sent via Paytm UPI"
                  : isHindi
                  ? `सभी को भेजें (₹${totalPendingAmount.toLocaleString("en-IN")})`
                  : `Send to All via Paytm UPI (₹${totalPendingAmount.toLocaleString("en-IN")})`}
              </span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
