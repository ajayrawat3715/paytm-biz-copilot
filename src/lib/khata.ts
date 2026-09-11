export type UdharStatus = "settled" | "overdue" | "active";
export type PaymentMode = "cash" | "paytm_qr" | "upi";

export type Repayment = {
  id: string;
  amount: number;
  /** IST calendar date, yyyy-mm-dd */
  date: string;
  mode: PaymentMode;
};

export type UdharEntry = {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: number;
  /** IST calendar date, yyyy-mm-dd */
  soldOn: string;
  dueOn: string;
  repayments: Repayment[];
};

export const shop = {
  name: "Annapurna Kirana",
  area: "Goripur, Patna",
  owner: "Ramesh",
  initial: "A",
};

/** Counter sales settled on the spot today, and cash paid out today. */
export const dailyCash = {
  cashSales: 18420,
  usualSales: 21900,
  expenses: 1250,
  last7: [26, 34, 30, 40, 36, 48, 38, 44],
};

export const glance = [
  { label: "Repeat customers", value: "68", suffix: "%", note: "of this week's spend" },
  { label: "Top category", value: "Dairy", note: "₹4,200 today" },
  { label: "Low stock", value: "3", suffix: " items", note: "biscuits, oil, masala" },
];

export type Opportunity = {
  id: string;
  title: string;
  body: string;
  tag: string;
  tagTone: "gain" | "neutral";
  primary: string;
  secondary: string;
  doneLabel: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "lapsed",
    title: "Tuesdays are dead — revive them",
    body: "Send a 10% off blast to 240 lapsed customers who last shopped with you over 15 days ago.",
    tag: "+₹6,100",
    tagTone: "gain",
    primary: "Approve and send",
    secondary: "Skip",
    doneLabel: "Blast queued for 6 PM to 240 customers.",
  },
  {
    id: "stock",
    title: "Parle biscuits at zero stock",
    body: "You sold the last packet yesterday. Reorder 24 units from Sharma Distributors before your evening rush.",
    tag: "Avoid loss",
    tagTone: "neutral",
    primary: "Place order",
    secondary: "Remind me",
    doneLabel: "Order for 24 units sent to Sharma Distributors.",
  },
  {
    id: "combo",
    title: "Evening chai-time combo",
    body: "Sales dip between 4 and 6 PM. A biscuit + tea leaf combo at ₹99 fits what your regulars already buy together.",
    tag: "+₹3,400",
    tagTone: "gain",
    primary: "Create combo",
    secondary: "Later",
    doneLabel: "Combo created and live on your Paytm storefront.",
  },
];

/* ---------------------------------- IST ---------------------------------- */

/** Today's calendar date in Asia/Kolkata, yyyy-mm-dd. */
export const istToday = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/** An IST calendar date n days from today, yyyy-mm-dd. */
export const istDaysFromToday = (n: number): string => {
  const base = new Date(istToday() + "T00:00:00Z");
  base.setUTCDate(base.getUTCDate() + n);
  return base.toISOString().slice(0, 10);
};

export const daysBetween = (from: string, to: string) =>
  Math.round(
    (Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86400000,
  );

/* -------------------------------- helpers -------------------------------- */

export const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export const modeLabel: Record<PaymentMode, string> = {
  cash: "Cash",
  paytm_qr: "Paytm QR",
  upi: "UPI",
};

export const paidOf = (e: UdharEntry) =>
  e.repayments.reduce((sum, r) => sum + r.amount, 0);

export const balanceOf = (e: UdharEntry) => Math.max(0, e.amount - paidOf(e));

/**
 * Settled  -> balance is zero
 * Overdue  -> balance > 0 and due date is before today in IST
 * Active   -> balance > 0 and due date is today or later in IST
 * (a due date of today stays Active until 23:59:59 IST)
 */
export const statusOf = (e: UdharEntry): UdharStatus => {
  if (balanceOf(e) <= 0) return "settled";
  return e.dueOn < istToday() ? "overdue" : "active";
};

export const statusLabel = (e: UdharEntry) => {
  const status = statusOf(e);
  if (status === "settled") return "Settled";
  if (status === "overdue") return "Overdue";
  return e.dueOn === istToday() ? "Due today" : "Active";
};

export const daysLate = (e: UdharEntry) =>
  Math.max(0, daysBetween(e.dueOn, istToday()));

export const formatDay = (isoDate: string) =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });

export const receiptMessage = (
  customer: string,
  amount: number,
  remaining: number,
) =>
  `Namaste ${customer} ji, aapka ${rupees(amount)} ka bhugtan prapt hua. Baki bacha udhar: ${rupees(remaining)}. Dhanyawad - ${shop.name}.`;

export const whatsappLink = (phone: string, message: string) => {
  const digits = phone.replace(/\D/g, "");
  const withCode = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCode}?text=${encodeURIComponent(message)}`;
};

export const seedUdhar = (): UdharEntry[] => [
  {
    id: "u1",
    customer: "Lakshmi Devi",
    phone: "98350 41122",
    items: "Atta 10kg, oil, masala",
    amount: 2400,
    soldOn: istDaysFromToday(-12),
    dueOn: istDaysFromToday(-6),
    repayments: [],
  },
  {
    id: "u2",
    customer: "Suresh Yadav",
    phone: "97710 88204",
    items: "Monthly ration",
    amount: 5600,
    soldOn: istDaysFromToday(-9),
    dueOn: istDaysFromToday(-2),
    repayments: [
      { id: "r1", amount: 2000, date: istDaysFromToday(-4), mode: "upi" },
    ],
  },
  {
    id: "u3",
    customer: "Anita Sharma",
    phone: "99340 77510",
    items: "Milk, curd, bread (weekly)",
    amount: 860,
    soldOn: istDaysFromToday(-3),
    dueOn: istToday(),
    repayments: [],
  },
  {
    id: "u4",
    customer: "Md. Irfan",
    phone: "96190 33417",
    items: "Rice 25kg",
    amount: 1750,
    soldOn: istDaysFromToday(-20),
    dueOn: istDaysFromToday(-11),
    repayments: [
      { id: "r2", amount: 1000, date: istDaysFromToday(-8), mode: "cash" },
      { id: "r3", amount: 750, date: istToday(), mode: "paytm_qr" },
    ],
  },
  {
    id: "u5",
    customer: "Ravi Prasad",
    phone: "95720 60113",
    items: "Sugar 5kg, tea leaf",
    amount: 640,
    soldOn: istDaysFromToday(-6),
    dueOn: istDaysFromToday(6),
    repayments: [
      { id: "r4", amount: 300, date: istToday(), mode: "cash" },
    ],
  },
];
