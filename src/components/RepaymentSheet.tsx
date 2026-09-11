import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UdharBadge } from "@/components/UdharBadge";
import {
  balanceOf,
  daysLate,
  formatDay,
  modeLabel,
  paidOf,
  receiptMessage,
  rupees,
  statusOf,
  whatsappLink,
  type PaymentMode,
  type UdharEntry,
} from "@/lib/khata";
import { cn } from "@/lib/utils";

const PRESETS = [200, 500, 1000];
const MODES: PaymentMode[] = ["cash", "paytm_qr", "upi"];

export function RepaymentSheet({
  entry,
  open,
  onOpenChange,
  onRecord,
}: {
  entry: UdharEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecord: (entryId: string, amount: number, mode: PaymentMode) => void;
}) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("cash");
  const [receipt, setReceipt] = useState<{ text: string; href: string } | null>(
    null,
  );

  const balance = entry ? balanceOf(entry) : 0;

  useEffect(() => {
    setAmount("");
    setMode("cash");
    setReceipt(null);
  }, [entry?.id, open]);

  const parsed = useMemo(() => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.min(n, balance);
  }, [amount, balance]);

  if (!entry) return null;

  const record = () => {
    if (parsed <= 0) return;
    const remaining = balance - parsed;
    const text = receiptMessage(entry.customer, parsed, remaining);
    onRecord(entry.id, parsed, mode);
    setReceipt({ text, href: whatsappLink(entry.phone, text) });
    setAmount("");
  };

  const history = [...entry.repayments].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto border-line bg-cream p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-line bg-paper px-5 py-5 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="font-display text-xl font-semibold text-ink">
                {entry.customer}
              </SheetTitle>
              <SheetDescription className="text-sm text-inksoft">
                {entry.phone} · {entry.items}
              </SheetDescription>
            </div>
            <UdharBadge entry={entry} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-inksoft">Outstanding</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {rupees(balance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-inksoft">Lent</p>
              <p className="font-display text-2xl font-semibold text-inksoft">
                {rupees(entry.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-inksoft">Repaid</p>
              <p className="font-display text-2xl font-semibold text-emerald">
                {rupees(paidOf(entry))}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-inksoft">
            Given {formatDay(entry.soldOn)} · due {formatDay(entry.dueOn)}
            {statusOf(entry) === "overdue" && (
              <span className="text-rust"> · {daysLate(entry)} days late</span>
            )}
          </p>
        </SheetHeader>

        <div className="px-5 py-5">
          {balance > 0 ? (
            <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
              <p className="font-display text-[17px] font-semibold">
                Record a payment
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.filter((p) => p < balance).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium ring-1 ring-line",
                      Number(amount) === preset
                        ? "bg-ink text-cream ring-ink"
                        : "bg-cream text-ink",
                    )}
                  >
                    {rupees(preset)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(String(balance))}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium ring-1 ring-line",
                    Number(amount) === balance
                      ? "bg-ink text-cream ring-ink"
                      : "bg-cream text-ink",
                  )}
                >
                  Full balance
                </button>
              </div>

              <label className="mt-4 block text-xs text-inksoft" htmlFor="amt">
                Amount received
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5 ring-1 ring-line">
                <span className="font-display text-lg text-inksoft">₹</span>
                <input
                  id="amt"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="0"
                  className="w-full bg-transparent font-display text-lg font-semibold text-ink outline-none placeholder:text-inksoft/50"
                />
              </div>

              <p className="mt-4 text-xs text-inksoft">Paid by</p>
              <div className="mt-1.5 flex gap-2">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 ring-line",
                      mode === m ? "bg-ink text-cream ring-ink" : "bg-cream text-ink",
                    )}
                  >
                    {modeLabel[m]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={parsed <= 0}
                onClick={record}
                className="mt-4 w-full rounded-full bg-rust px-4 py-3 text-sm font-semibold text-cream ring-1 ring-rust/40 disabled:opacity-40"
              >
                {parsed >= balance && parsed > 0
                  ? `Settle ${rupees(parsed)} in full`
                  : `Record ${parsed > 0 ? rupees(parsed) : "payment"}`}
              </button>
            </div>
          ) : (
            <div className="rounded-[18px] bg-emerald/10 p-4 text-sm text-emerald ring-1 ring-emerald/20">
              This khata is fully settled. Nothing pending.
            </div>
          )}

          {receipt && (
            <div className="mt-3 rounded-[18px] bg-paper p-4 ring-1 ring-line">
              <p className="font-display text-[15px] font-semibold">
                Receipt ready to send
              </p>
              <p className="mt-1.5 rounded-xl bg-cream p-3 text-sm text-inksoft">
                {receipt.text}
              </p>
              <a
                href={receipt.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-full bg-emerald px-4 py-2.5 text-sm font-semibold text-cream"
              >
                Send on WhatsApp
              </a>
            </div>
          )}

          <p className="mt-6 font-display text-[17px] font-semibold">
            Repayment history
          </p>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-inksoft">
              No payments received yet on this khata.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {history.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-[14px] bg-paper px-4 py-3 ring-1 ring-line"
                >
                  <div>
                    <p className="font-display text-[15px] font-semibold">
                      {rupees(r.amount)}
                    </p>
                    <p className="text-xs text-inksoft">
                      {formatDay(r.date)} · {modeLabel[r.mode]}
                    </p>
                  </div>
                  <a
                    href={whatsappLink(
                      entry.phone,
                      receiptMessage(entry.customer, r.amount, balance),
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-inksoft underline underline-offset-4"
                  >
                    Resend receipt
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
