import { useCallback, useEffect, useMemo, useState } from "react";
import {
  balanceOf,
  dailyCash,
  istToday,
  paidOf,
  seedUdhar,
  statusOf,
  type PaymentMode,
  type Repayment,
  type UdharEntry,
} from "./khata";

const STORAGE_KEY = "bahi-khata-udhar-v1";

const makeId = () => Math.random().toString(36).slice(2, 10);

export type NewUdharInput = {
  customer: string;
  phone: string;
  items: string;
  amount: number;
  dueOn: string;
};

export function useKhata() {
  const [entries, setEntries] = useState<UdharEntry[]>(seedUdhar);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as UdharEntry[]);
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore full storage */
    }
  }, [entries, hydrated]);

  const addEntry = useCallback((input: NewUdharInput) => {
    setEntries((prev) => [
      {
        ...input,
        id: makeId(),
        soldOn: istToday(),
        repayments: [],
      },
      ...prev,
    ]);
  }, []);

  const addRepayment = useCallback(
    (entryId: string, amount: number, mode: PaymentMode) => {
      const payment: Repayment = {
        id: makeId(),
        amount,
        mode,
        date: istToday(),
      };
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, repayments: [...e.repayments, payment] } : e,
        ),
      );
    },
    [],
  );

  const totals = useMemo(() => {
    const today = istToday();
    const todaysRepayments = entries.flatMap((e) =>
      e.repayments.filter((r) => r.date === today),
    );
    const byMode = (mode: PaymentMode) =>
      todaysRepayments
        .filter((r) => r.mode === mode)
        .reduce((s, r) => s + r.amount, 0);

    const udharCollectedToday = todaysRepayments.reduce(
      (s, r) => s + r.amount,
      0,
    );
    const overdue = entries.filter((e) => statusOf(e) === "overdue");

    return {
      outstanding: entries.reduce((sum, e) => sum + balanceOf(e), 0),
      udharCollectedToday,
      collectedCash: byMode("cash"),
      collectedPaytm: byMode("paytm_qr") + byMode("upi"),
      cashSales: dailyCash.cashSales,
      expenses: dailyCash.expenses,
      netDaily: dailyCash.cashSales + udharCollectedToday - dailyCash.expenses,
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, e) => sum + balanceOf(e), 0),
      openCount: entries.filter((e) => statusOf(e) !== "settled").length,
      lentTotal: entries.reduce((sum, e) => sum + e.amount, 0),
      repaidTotal: entries.reduce((sum, e) => sum + paidOf(e), 0),
    };
  }, [entries]);

  return { entries, addEntry, addRepayment, totals };
}
