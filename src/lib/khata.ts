export type UdharStatus = "settled" | "overdue" | "active";
export type PaymentMode = "cash" | "paytm_qr" | "upi";

export * from "./mock-data";

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
    id: "u-overdue-1",
    customer: "Rajesh Kumar",
    phone: "98350 41122",
    items: "Atta 10kg, Mustard Oil",
    amount: 800,
    soldOn: istDaysFromToday(-15),
    dueOn: istDaysFromToday(-8),
    repayments: [],
  },
  {
    id: "u-overdue-2",
    customer: "Sunita Devi",
    phone: "98721 55431",
    items: "Monthly spices, Turmeric, Dal",
    amount: 650,
    soldOn: istDaysFromToday(-20),
    dueOn: istDaysFromToday(-12),
    repayments: [],
  },
  {
    id: "u-overdue-3",
    customer: "Amit Verma",
    phone: "99341 88204",
    items: "Sugar 5kg, Tata Tea Premium",
    amount: 500,
    soldOn: istDaysFromToday(-10),
    dueOn: istDaysFromToday(-5),
    repayments: [],
  },
  {
    id: "u-overdue-4",
    customer: "Manoj Singh",
    phone: "97712 33417",
    items: "Amul Milk 2L, Butter, Bread",
    amount: 450,
    soldOn: istDaysFromToday(-14),
    dueOn: istDaysFromToday(-7),
    repayments: [],
  },
  {
    id: "u-overdue-5",
    customer: "Vikram Patel",
    phone: "96190 77510",
    items: "Detergent powder, Lifebuoy soap",
    amount: 400,
    soldOn: istDaysFromToday(-25),
    dueOn: istDaysFromToday(-14),
    repayments: [],
  },
  {
    id: "u-today-1",
    customer: "Anita Sharma",
    phone: "99340 77510",
    items: "Milk, curd, bakery basket",
    amount: 1800,
    soldOn: istDaysFromToday(-3),
    dueOn: istToday(),
    repayments: [],
  },
  {
    id: "u-today-2",
    customer: "Suresh Yadav",
    phone: "97710 88204",
    items: "Monthly ration, Basmati rice",
    amount: 2400,
    soldOn: istDaysFromToday(-8),
    dueOn: istToday(),
    repayments: [
      { id: "r-suresh", amount: 1000, date: istToday(), mode: "upi" },
    ],
  },
  {
    id: "u-active-1",
    customer: "Lakshmi Devi",
    phone: "98350 41122",
    items: "Refined oil 5L, Dry fruits",
    amount: 4200,
    soldOn: istDaysFromToday(-2),
    dueOn: istDaysFromToday(5),
    repayments: [],
  },
  {
    id: "u-active-2",
    customer: "Ravi Prasad",
    phone: "95720 60113",
    items: "Sugar 5kg, tea leaf, biscuits",
    amount: 3000,
    soldOn: istDaysFromToday(-4),
    dueOn: istDaysFromToday(8),
    repayments: [
      { id: "r-ravi", amount: 360, date: istToday(), mode: "cash" },
    ],
  },
];
