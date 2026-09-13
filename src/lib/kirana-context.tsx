import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  balanceOf,
  dailyCash,
  istDaysFromToday,
  istToday,
  paidOf,
  seedUdhar,
  statusOf,
  type PaymentMode,
  type Repayment,
  type UdharEntry,
} from "./khata";
import {
  customerDirectory as defaultCustomers,
  inventoryCatalog as defaultInventory,
  type InventoryItem,
} from "./mock-data";

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  status: "overdue" | "regular" | "inactive";
  riskLevel: "high" | "moderate" | "low";
  balance: number;
  daysOverdue: number;
  lastPurchase: string;
  items: string;
  totalVisits: number;
  paymentPreference: string;
  reminded?: boolean;
}

export interface VoiceTransactionPayload {
  customer: string;
  items: string;
  amount: number;
  type: "credit" | "payment";
}

interface KiranaDataContextType {
  customers: CustomerRecord[];
  inventory: InventoryItem[];
  khataEntries: UdharEntry[];
  activeCampaigns: Record<string, boolean>;
  autopilotCompleted: boolean;
  totals: {
    outstanding: number;
    overdueAmount: number;
    overdueCount: number;
    udharCollectedToday: number;
    cashSales: number;
    expenses: number;
    netDaily: number;
    totalStockoutItems: number;
    estimatedStockLoss: number;
  };
  // Actions
  applyVoiceTransaction: (payload: VoiceTransactionPayload) => void;
  recordCustomerRepayment: (customerIdOrName: string, amount: number, mode?: PaymentMode) => void;
  addCustomerUdhar: (
    customerName: string,
    phone: string,
    amount: number,
    items: string,
    dueDays?: number,
  ) => void;
  orderInventoryStock: (itemId: string, quantity?: number) => void;
  approveAutopilotActions: () => void;
  launchCampaign: (campaignId: string) => void;
  sendCustomerReminder: (customerId: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = "bharat-kirana-store-v2";

const KiranaDataContext = createContext<KiranaDataContextType | null>(null);

export function KiranaDataProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [customers, setCustomers] = useState<CustomerRecord[]>(defaultCustomers as CustomerRecord[]);
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);
  const [khataEntries, setKhataEntries] = useState<UdharEntry[]>(seedUdhar);
  const [activeCampaigns, setActiveCampaigns] = useState<Record<string, boolean>>({});
  const [autopilotCompleted, setAutopilotCompleted] = useState(false);

  // 1. Hydrate from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.khataEntries) setKhataEntries(parsed.khataEntries);
        if (parsed.activeCampaigns) setActiveCampaigns(parsed.activeCampaigns);
        if (parsed.autopilotCompleted !== undefined) setAutopilotCompleted(parsed.autopilotCompleted);
      }
    } catch (e) {
      console.warn("Failed to load Kirana store from localStorage:", e);
    }
    setHydrated(true);
  }, []);

  // 2. Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customers,
          inventory,
          khataEntries,
          activeCampaigns,
          autopilotCompleted,
        }),
      );
    } catch (e) {
      console.warn("Failed to save Kirana store to localStorage:", e);
    }
  }, [customers, inventory, khataEntries, activeCampaigns, autopilotCompleted, hydrated]);

  // Apply a Voice-to-Ledger transaction (Credit or Payment)
  const applyVoiceTransaction = (payload: VoiceTransactionPayload) => {
    const { customer: name, items, amount, type } = payload;
    if (!name || amount <= 0) return;

    const trimmedName = name.trim();
    const today = istToday();

    // 1. Update Customers list
    setCustomers((prev) => {
      const index = prev.findIndex(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase() ||
               c.name.toLowerCase().includes(trimmedName.toLowerCase()) ||
               trimmedName.toLowerCase().includes(c.name.toLowerCase())
      );

      if (index >= 0) {
        const existing = prev[index];
        const newBalance =
          type === "credit"
            ? existing.balance + amount
            : Math.max(0, existing.balance - amount);

        const updated: CustomerRecord = {
          ...existing,
          balance: newBalance,
          status: newBalance === 0 ? "regular" : existing.daysOverdue > 0 ? "overdue" : "regular",
          lastPurchase: "Just now (Voice Logged)",
          items: type === "credit" ? `${items} (+₹${amount})` : existing.items,
        };

        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }

      // New customer created via voice
      const newCust: CustomerRecord = {
        id: `cust-voice-${Date.now()}`,
        name: trimmedName,
        phone: "+91 98000 " + Math.floor(10000 + Math.random() * 90000),
        status: type === "credit" ? "regular" : "regular",
        riskLevel: "low",
        balance: type === "credit" ? amount : 0,
        daysOverdue: 0,
        lastPurchase: "Just now (Voice Logged)",
        items: items || "Counter goods",
        totalVisits: 1,
        paymentPreference: "Paytm UPI Soundbox",
      };

      return [newCust, ...prev];
    });

    // 2. Update Khata entries
    setKhataEntries((prev) => {
      if (type === "credit") {
        const newEntry: UdharEntry = {
          id: `u-voice-${Date.now()}`,
          customer: trimmedName,
          phone: "98350 " + Math.floor(10000 + Math.random() * 90000),
          items: items || "Counter Udhaar",
          amount,
          soldOn: today,
          dueOn: istDaysFromToday(7),
          repayments: [],
        };
        return [newEntry, ...prev];
      } else {
        // Find existing open entry for this customer
        const entryIdx = prev.findIndex(
          (e) => e.customer.toLowerCase().includes(trimmedName.toLowerCase()) && balanceOf(e) > 0
        );

        if (entryIdx >= 0) {
          const target = prev[entryIdx];
          const newRepayment: Repayment = {
            id: `r-voice-${Date.now()}`,
            amount,
            date: today,
            mode: "paytm_qr",
          };
          const updatedEntry: UdharEntry = {
            ...target,
            repayments: [...target.repayments, newRepayment],
          };
          const copy = [...prev];
          copy[entryIdx] = updatedEntry;
          return copy;
        }

        return prev;
      }
    });
  };

  // Record a customer repayment directly
  const recordCustomerRepayment = (
    customerIdOrName: string,
    amount: number,
    mode: PaymentMode = "paytm_qr",
  ) => {
    if (amount <= 0) return;
    const today = istToday();

    let matchedCustomerName = "";

    setKhataEntries((prev) => {
      const idx = prev.findIndex(
        (e) =>
          e.id === customerIdOrName ||
          e.customer.toLowerCase() === customerIdOrName.toLowerCase() ||
          e.customer.toLowerCase().includes(customerIdOrName.toLowerCase())
      );

      if (idx >= 0) {
        const entry = prev[idx];
        matchedCustomerName = entry.customer;
        const newPayment: Repayment = {
          id: `r-${Date.now()}`,
          amount,
          date: today,
          mode,
        };
        const copy = [...prev];
        copy[idx] = { ...entry, repayments: [...entry.repayments, newPayment] };
        return copy;
      }
      return prev;
    });

    setCustomers((prev) =>
      prev.map((c) => {
        const matches =
          c.id === customerIdOrName ||
          c.name.toLowerCase() === customerIdOrName.toLowerCase() ||
          (matchedCustomerName && c.name.toLowerCase() === matchedCustomerName.toLowerCase());

        if (matches) {
          const newBalance = Math.max(0, c.balance - amount);
          return {
            ...c,
            balance: newBalance,
            status: newBalance === 0 ? "regular" : c.status,
            lastPurchase: `Repaid ₹${amount} (${today})`,
          };
        }
        return c;
      })
    );
  };

  // Add new Udhaar credit
  const addCustomerUdhar = (
    customerName: string,
    phone: string,
    amount: number,
    items: string,
    dueDays: number = 7,
  ) => {
    if (!customerName || amount <= 0) return;
    const today = istToday();

    setCustomers((prev) => {
      const idx = prev.findIndex(
        (c) => c.name.toLowerCase() === customerName.toLowerCase()
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          balance: copy[idx].balance + amount,
          items: `${items} (+₹${amount})`,
          lastPurchase: `Udhaar ₹${amount} (${today})`,
        };
        return copy;
      }
      const newCust: CustomerRecord = {
        id: `cust-${Date.now()}`,
        name: customerName,
        phone: phone || "+91 98000 00000",
        status: "regular",
        riskLevel: "low",
        balance: amount,
        daysOverdue: 0,
        lastPurchase: "Today",
        items,
        totalVisits: 1,
        paymentPreference: "Paytm UPI",
      };
      return [newCust, ...prev];
    });

    setKhataEntries((prev) => [
      {
        id: `u-${Date.now()}`,
        customer: customerName,
        phone: phone || "98350 00000",
        items,
        amount,
        soldOn: today,
        dueOn: istDaysFromToday(dueDays),
        repayments: [],
      },
      ...prev,
    ]);
  };

  // Order & restock inventory
  const orderInventoryStock = (itemId: string, quantity?: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const addQty = quantity || item.reorderLevel;
          const newStock = item.stock + addQty;
          const daysRemaining = Number((newStock / item.dailyVelocity).toFixed(1));
          return {
            ...item,
            stock: newStock,
            daysRemaining,
            status: "healthy",
          };
        }
        return item;
      })
    );
  };

  // Approve Autopilot 3 actions
  const approveAutopilotActions = () => {
    // 1. Restock Parle biscuits
    orderInventoryStock("inv-1", 24);

    // 2. Activate 10% campaign
    setActiveCampaigns((prev) => ({ ...prev, "lapsed-10": true, "tuesday-flash": true }));

    // 3. Mark all overdue customer reminders sent
    setCustomers((prev) =>
      prev.map((c) => (c.status === "overdue" ? { ...c, reminded: true } : c))
    );

    setAutopilotCompleted(true);
  };

  // Launch a campaign
  const launchCampaign = (campaignId: string) => {
    setActiveCampaigns((prev) => ({ ...prev, [campaignId]: true }));
  };

  // Mark reminder sent for a customer
  const sendCustomerReminder = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, reminded: true } : c))
    );
  };

  // Reset to initial seed data
  const resetToDefault = () => {
    setCustomers(defaultCustomers as CustomerRecord[]);
    setInventory(defaultInventory);
    setKhataEntries(seedUdhar);
    setActiveCampaigns({});
    setAutopilotCompleted(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Computed real-time business totals
  const totals = useMemo(() => {
    const totalOutstanding = customers.reduce((sum, c) => sum + c.balance, 0);
    const overdueCusts = customers.filter((c) => c.status === "overdue" && c.balance > 0);
    const overdueAmount = overdueCusts.reduce((sum, c) => sum + c.balance, 0);
    const openCustomers = customers.filter((c) => c.balance > 0);

    const outOfStockItems = inventory.filter((item) => item.stock === 0);
    const estimatedStockLoss = outOfStockItems.reduce(
      (sum, item) => sum + item.dailyVelocity * item.price,
      0
    );

    const today = istToday();
    const todaysRepayments = khataEntries.flatMap((e) =>
      e.repayments.filter((r) => r.date === today)
    );
    const udharCollectedToday = todaysRepayments.reduce((s, r) => s + r.amount, 0);
    const byMode = (mode: PaymentMode) =>
      todaysRepayments
        .filter((r) => r.mode === mode)
        .reduce((s, r) => s + r.amount, 0);

    const collectedCash = byMode("cash");
    const collectedPaytm = byMode("paytm_qr") + byMode("upi");

    return {
      outstanding: totalOutstanding,
      openCount: openCustomers.length,
      overdueAmount,
      overdueCount: overdueCusts.length,
      udharCollectedToday,
      collectedCash,
      collectedPaytm,
      cashSales: dailyCash.cashSales,
      expenses: dailyCash.expenses,
      netDaily: dailyCash.cashSales + udharCollectedToday - dailyCash.expenses,
      totalStockoutItems: outOfStockItems.length,
      estimatedStockLoss,
      lentTotal: khataEntries.reduce((sum, e) => sum + e.amount, 0),
      repaidTotal: khataEntries.reduce((sum, e) => sum + paidOf(e), 0),
    };
  }, [customers, inventory, khataEntries]);

  const value = useMemo(
    () => ({
      customers,
      inventory,
      khataEntries,
      activeCampaigns,
      autopilotCompleted,
      totals,
      applyVoiceTransaction,
      recordCustomerRepayment,
      addCustomerUdhar,
      orderInventoryStock,
      approveAutopilotActions,
      launchCampaign,
      sendCustomerReminder,
      resetToDefault,
    }),
    [customers, inventory, khataEntries, activeCampaigns, autopilotCompleted, totals],
  );

  return <KiranaDataContext.Provider value={value}>{children}</KiranaDataContext.Provider>;
}

export function useKiranaData() {
  const context = useContext(KiranaDataContext);
  if (!context) {
    throw new Error("useKiranaData must be used within a KiranaDataProvider");
  }
  return context;
}
