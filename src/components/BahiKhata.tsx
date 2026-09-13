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
          <h2 className="font-display text-xl font-semibold">
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
        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-inksoft">Total credit outstanding</p>
          <p className="mt-1 font-display text-[34px] font-semibold leading-none tracking-tight">
            {rupees(totals.outstanding)}
          </p>
          <p className="mt-2 text-sm text-inksoft">
            {totals.openCount} khatas open ·{" "}
            <span className="font-medium text-rust">
              {rupees(totals.overdueAmount)} overdue
            </span>{" "}
            across {totals.overdueCount}
          </p>
        </div>

        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-inksoft">Today's udhar collections</p>
          <p className="mt-1 font-display text-[34px] font-semibold leading-none tracking-tight text-emerald">
            {rupees(totals.udharCollectedToday)}
          </p>
          <p className="mt-2 text-sm text-inksoft">
            <span className="font-medium text-ink">
              {rupees(totals.collectedCash)}
            </span>{" "}
            cash ·{" "}
            <span className="font-medium text-ink">
              {rupees(totals.collectedPaytm)}
            </span>{" "}
            UPI / Paytm
          </p>
        </div>

        <div className="rounded-[18px] bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-inksoft">Net daily balance</p>
          <p className="mt-1 font-display text-[34px] font-semibold leading-none tracking-tight">
            {rupees(totals.netDaily)}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-sand px-2.5 py-1 font-medium">
              Cash sales {rupees(totals.cashSales)}
            </span>
            <span className="rounded-full bg-emerald/10 px-2.5 py-1 font-medium text-emerald">
              Udhar back {rupees(totals.udharCollectedToday)}
            </span>
            <span className="rounded-full bg-rust/10 px-2.5 py-1 font-medium text-rust">
              Expenses −{rupees(totals.expenses)}
            </span>
          </div>
        </div>
      </div>

      {/* per-customer ledger */}
      <div className="mt-4 rounded-[18px] bg-paper ring-1 ring-line">
        <div className="flex items-baseline justify-between px-5 pt-4">
          <p className="font-display text-[17px] font-semibold">
            Who owes you
          </p>
          <span className="text-xs text-inksoft">
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
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[16px] font-semibold">
                        {entry.customer}
                      </p>
                      <UdharBadge entry={entry} />
                    </div>
                    <p className="mt-1 truncate text-sm text-inksoft">
                      {entry.items} · due {formatDay(entry.dueOn)}
                      {status === "overdue" && (
                        <span className="text-rust">
                          {" "}
                          · {daysLate(entry)} days late
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "font-display text-[19px] font-semibold",
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
