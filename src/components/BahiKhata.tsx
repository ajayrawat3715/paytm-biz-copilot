import { useState } from "react";
import { NewUdharDialog } from "@/components/NewUdharDialog";
import { RepaymentSheet } from "@/components/RepaymentSheet";
import { UdharBadge } from "@/components/UdharBadge";
import {
  balanceOf,
  daysLate,
  formatDay,
  istToday,
  rupees,
  statusOf,
  type UdharEntry,
} from "@/lib/khata";
import type { useKhata } from "@/lib/use-khata";
import { cn } from "@/lib/utils";

type Khata = ReturnType<typeof useKhata>;

export function BahiKhata({ khata }: { khata: Khata }) {
  const { entries, totals, addEntry, addRepayment } = khata;
  const [selected, setSelected] = useState<UdharEntry | null>(null);
  const [open, setOpen] = useState(false);

  const openLedger = (entry: UdharEntry) => {
    setSelected(entry);
    setOpen(true);
  };

  // keep the drawer in sync with fresh state after a repayment
  const live = selected
    ? (entries.find((e) => e.id === selected.id) ?? selected)
    : null;

  const sorted = [...entries].sort((a, b) => {
    const rank = (e: UdharEntry) =>
      statusOf(e) === "overdue" ? 0 : statusOf(e) === "active" ? 1 : 2;
    return rank(a) - rank(b) || balanceOf(b) - balanceOf(a);
  });

  return (
    <section className="mt-8 animate-settle">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-sans text-xl font-semibold text-ink">
            Today's bahi-khata
          </h2>
          <p className="text-xs text-inksoft">
            {formatDay(istToday())} · India time, resets at midnight
          </p>
        </div>
        <NewUdharDialog onCreate={addEntry} />
      </div>

      {/* three totals */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-sm text-inksoft">Total credit outstanding</p>
          <p className="mt-1 font-sans text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums text-ink">
            {rupees(totals.outstanding)}
          </p>
          <p className="mt-2 text-sm text-inksoft">
            {totals.openCount} khatas open ·{" "}
            <span className="font-semibold text-rust tabular-nums">
              {rupees(totals.overdueAmount)} overdue
            </span>{" "}
            across {totals.overdueCount}
          </p>
        </div>

        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-sm text-inksoft">Today's udhar collections</p>
          <p className="mt-1 font-sans text-[34px] font-bold leading-none tracking-[-0.02em] text-emerald tabular-nums">
            {rupees(totals.udharCollectedToday)}
          </p>
          <p className="mt-2 text-sm text-inksoft">
            <span className="font-medium text-ink tabular-nums">
              {rupees(totals.collectedCash)}
            </span>{" "}
            cash ·{" "}
            <span className="font-medium text-ink tabular-nums">
              {rupees(totals.collectedPaytm)}
            </span>{" "}
            UPI / Paytm
          </p>
        </div>

        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line shadow-2xs">
          <p className="text-sm text-inksoft">Net daily balance</p>
          <p className="mt-1 font-sans text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums text-ink">
            {rupees(totals.netDaily)}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-sand px-2.5 py-1 font-medium tabular-nums">
              Cash sales {rupees(totals.cashSales)}
            </span>
            <span className="rounded-full bg-emerald-light px-2.5 py-1 font-semibold text-emerald tabular-nums">
              Udhar back {rupees(totals.udharCollectedToday)}
            </span>
            <span className="rounded-full bg-rust-light px-2.5 py-1 font-semibold text-rust tabular-nums">
              Expenses −{rupees(totals.expenses)}
            </span>
          </div>
        </div>
      </div>

      {/* per-customer ledger */}
      <div className="mt-4 rounded-2xl bg-paper ring-1 ring-line shadow-2xs overflow-hidden">
        <div className="flex items-baseline justify-between px-5 pt-4 pb-1">
          <p className="font-sans text-[17px] font-semibold text-ink">
            Who owes you
          </p>
          <span className="text-xs text-inksoft tabular-nums">
            {rupees(totals.repaidTotal)} of {rupees(totals.lentTotal)} recovered
          </span>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {sorted.map((entry) => {
            const balance = balanceOf(entry);
            const status = statusOf(entry);
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => openLedger(entry)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-sans text-[15px] font-semibold text-ink">
                        {entry.customer}
                      </p>
                      <UdharBadge entry={entry} />
                    </div>
                    <p className="mt-1 truncate text-xs sm:text-sm text-inksoft">
                      {entry.items} · due {formatDay(entry.dueOn)}
                      {status === "overdue" && (
                        <span className="text-rust font-medium">
                          {" "}
                          · {daysLate(entry)} days late
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "font-sans text-[18px] font-semibold tabular-nums",
                        status === "settled" ? "text-inksoft" : "text-ink",
                      )}
                    >
                      {rupees(balance)}
                    </p>
                    <p className="text-xs text-inksoft">
                      {status === "settled" ? "cleared" : "pending"}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <RepaymentSheet
        entry={live}
        open={open}
        onOpenChange={setOpen}
        onRecord={addRepayment}
      />
    </section>
  );
}
