import { useCallback, useEffect, useMemo, useState } from "react";
import {
  balanceOf,
  iso,
  paidOf,
  seedUdhar,
  statusOf,
  type Repayment,
  type UdharEntry,
} from "./khata";

const STORAGE_KEY = "bahi-khata-udhar-v1";

const makeId = () => Math.random().toString(36).slice(2, 10);

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

  const addEntry = useCallback(
    (entry: Omit<UdharEntry, "id" | "repayments">) => {
      setEntries((prev) => [{ ...entry, id: makeId(), repayments: [] }, ...prev]);
    },
    [],
  );

  const addRepayment = useCallback(
    (entryId: string, payment: Omit<Repayment, "id">) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? { ...e, repayments: [...e.repayments, { ...payment, id: makeId() }] }
            : e,
        ),
      );
    },
    [],
  );

  const totals = useMemo(() => {
    const today = iso(new Date());
    const outstanding = entries.reduce((sum, e) => sum + balanceOf(e), 0);
    const collectedToday = entries.reduce(
      (sum, e) =>
        sum +
        e.repayments
          .filter((r) => r.date === today)
          .reduce((s, r) => s + r.amount, 0),
      0,
    );
    const overdue = entries.filter((e) => statusOf(e) === "overdue");
    return {
      outstanding,
      collectedToday,
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, e) => sum + balanceOf(e), 0),
      openCount: entries.filter((e) => statusOf(e) !== "settled").length,
      lentTotal: entries.reduce((sum, e) => sum + e.amount, 0),
      repaidTotal: entries.reduce((sum, e) => sum + paidOf(e), 0),
    };
  }, [entries]);

  return { entries, addEntry, addRepayment, totals };
}
