export type UdharStatus = "settled" | "overdue" | "due";

export type Repayment = {
  id: string;
  amount: number;
  /** ISO date, yyyy-mm-dd */
  date: string;
  mode: "cash" | "upi";
};

export type UdharEntry = {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: number;
  /** ISO date, yyyy-mm-dd */
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

export const todaySales = {
  collected: 18420,
  usual: 21900,
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

export const iso = (d: Date) => d.toISOString().slice(0, 10);

export const daysFromToday = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const rupees = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const paidOf = (e: UdharEntry) =>
  e.repayments.reduce((sum, r) => sum + r.amount, 0);

export const balanceOf = (e: UdharEntry) => Math.max(0, e.amount - paidOf(e));

export const statusOf = (e: UdharEntry): UdharStatus => {
  if (balanceOf(e) <= 0) return "settled";
  return e.dueOn < iso(new Date()) ? "overdue" : "due";
};

export const daysLate = (e: UdharEntry) => {
  const diff = Date.parse(iso(new Date())) - Date.parse(e.dueOn);
  return Math.max(0, Math.round(diff / 86400000));
};

export const formatDay = (isoDate: string) =>
  new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

export const seedUdhar = (): UdharEntry[] => [
  {
    id: "u1",
    customer: "Lakshmi Devi",
    phone: "98350 41122",
    items: "Atta 10kg, oil, masala",
    amount: 2400,
    soldOn: daysFromToday(-12),
    dueOn: daysFromToday(-6),
    repayments: [],
  },
  {
    id: "u2",
    customer: "Suresh Yadav",
    phone: "97710 88204",
    items: "Monthly ration",
    amount: 5600,
    soldOn: daysFromToday(-9),
    dueOn: daysFromToday(-2),
    repayments: [{ id: "r1", amount: 2000, date: daysFromToday(-4), mode: "upi" }],
  },
  {
    id: "u3",
    customer: "Anita Sharma",
    phone: "99340 77510",
    items: "Milk, curd, bread (weekly)",
    amount: 860,
    soldOn: daysFromToday(-3),
    dueOn: daysFromToday(4),
    repayments: [],
  },
  {
    id: "u4",
    customer: "Md. Irfan",
    phone: "96190 33417",
    items: "Rice 25kg",
    amount: 1750,
    soldOn: daysFromToday(-20),
    dueOn: daysFromToday(-11),
    repayments: [
      { id: "r2", amount: 1000, date: daysFromToday(-8), mode: "cash" },
      { id: "r3", amount: 750, date: iso(new Date()), mode: "upi" },
    ],
  },
];
