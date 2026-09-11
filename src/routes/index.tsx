import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BahiKhata } from "@/components/BahiKhata";
import { CopilotChat } from "@/components/CopilotChat";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  balanceOf,
  dailyCash,
  formatDay,
  glance,
  istToday,
  opportunities,
  rupees,
  shop,
  statusLabel,
} from "@/lib/khata";
import { useKhata } from "@/lib/use-khata";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bahi-Khata Copilot — AI business partner for Paytm merchants" },
      {
        name: "description",
        content:
          "An AI copilot for Indian shopkeepers: daily sales, udhar tracking with repayments and reminders, and growth actions you can approve in one tap.",
      },
      {
        property: "og:title",
        content: "Bahi-Khata Copilot — AI business partner for Paytm merchants",
      },
      {
        property: "og:description",
        content:
          "Track udhar, collect repayments, and act on AI growth suggestions — in plain Hindi or English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const khata = useKhata();
  const { entries, totals } = khata;
  const [done, setDone] = useState<Record<string, string>>({});
  const [chatOpen, setChatOpen] = useState(false);

  const behind = dailyCash.usualSales - dailyCash.cashSales;

  const shopContext = useMemo(() => {
    const lines = entries
      .map(
        (e) =>
          `- ${e.customer} (${e.phone}): took ${e.items} for ${rupees(e.amount)} on ${formatDay(e.soldOn)}, due ${formatDay(e.dueOn)}, balance ${rupees(balanceOf(e))}, status ${statusLabel(e)}`,
      )
      .join("\n");
    return [
      `Shop: ${shop.name}, ${shop.area}. Owner: ${shop.owner}. Date: ${formatDay(istToday())} (IST).`,
      `Cash sales today: ${rupees(totals.cashSales)} (usual by now ${rupees(dailyCash.usualSales)}).`,
      `Cash expenses today: ${rupees(totals.expenses)}. Net take-home today: ${rupees(totals.netDaily)}.`,
      `Udhar collected today: ${rupees(totals.udharCollectedToday)} (${rupees(totals.collectedCash)} cash, ${rupees(totals.collectedPaytm)} UPI/Paytm).`,
      `Total credit outstanding: ${rupees(totals.outstanding)} across ${totals.openCount} open khatas; ${rupees(totals.overdueAmount)} overdue across ${totals.overdueCount} customers.`,
      `Repeat customers: 68% of this week's spend. Top category: Dairy (₹4,200 today). Low stock: biscuits, oil, masala.`,
      `Udhar ledger:\n${lines}`,
      `Pending copilot suggestions: ${opportunities
        .filter((o) => !done[o.id])
        .map((o) => o.title)
        .join("; ") || "none"}.`,
    ].join("\n");
  }, [entries, totals, done]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1180px] flex-col lg:flex-row">
        <main className="flex-1 px-4 pb-32 pt-6 sm:px-7 lg:pb-12">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-[10px] bg-rust font-display text-lg font-semibold leading-none text-cream">
                {shop.initial}
              </span>
              <div className="leading-tight">
                <p className="font-display text-[15px] font-semibold">
                  {shop.name}
                </p>
                <p className="text-xs text-inksoft">{shop.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-inksoft ring-1 ring-line sm:inline-flex">
                <span className="size-1.5 animate-tick rounded-full bg-emerald" />
                Copilot on
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-sand text-xs font-semibold text-ink ring-1 ring-line">
                {shop.owner[0]}
              </span>
            </div>
          </header>

          <section className="mt-7 animate-settle">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-rust">
              {new Date().toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mt-2 max-w-[40ch] text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Good morning, {shop.owner}.{" "}
              {behind > 0 ? "Today looks a little quiet." : "Today is running ahead."}
            </h1>

            <div className="mt-5 rounded-[20px] bg-paper p-5 ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-inksoft">Collected so far</p>
                  <p className="mt-1 font-display text-[40px] font-semibold leading-none tracking-tight">
                    {rupees(dailyCash.cashSales + totals.udharCollectedToday)}
                  </p>
                  <p className="mt-2 text-sm text-inksoft">
                    Your usual is{" "}
                    <span className="font-medium text-ink">
                      {rupees(dailyCash.usualSales)}
                    </span>
                    {behind > 0 ? (
                      <>
                        {" "}
                        — counter sales are{" "}
                        <span className="font-medium text-rust">
                          {rupees(behind)} behind
                        </span>{" "}
                        for this time of day.
                      </>
                    ) : (
                      " — you are ahead for this time of day."
                    )}
                  </p>
                </div>
                <div className="flex items-end gap-1" aria-label="last 8 days sales">
                  {dailyCash.last7.map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-2 rounded-t",
                        i === dailyCash.last7.length - 1 ? "bg-rust" : "bg-sand",
                      )}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-inksoft">
                Last 7 days ·{" "}
                <span className="inline-flex items-center gap-1 text-emerald">
                  <span className="size-1.5 animate-tick rounded-full bg-emerald" />
                  live
                </span>
              </p>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold">
                Worth doing today
              </h2>
              <span className="text-xs text-inksoft">
                {opportunities.length - Object.keys(done).length} ready
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {opportunities.map((o, i) => (
                <article
                  key={o.id}
                  className="animate-settle rounded-[18px] bg-paper p-4 ring-1 ring-line sm:p-5"
                  style={{ animationDelay: `${0.06 * (i + 1)}s` }}
                >
                  {done[o.id] ? (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-[17px] font-semibold leading-snug">
                          {o.title}
                        </p>
                        <p className="mt-1.5 text-sm text-emerald">
                          {done[o.id]}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald">
                        Done
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[17px] font-semibold leading-snug">
                            {o.title}
                          </p>
                          <p className="mt-1.5 max-w-[46ch] text-pretty text-sm text-inksoft">
                            {o.body}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                            o.tagTone === "gain"
                              ? "bg-emerald/10 text-emerald"
                              : "bg-sand text-ink",
                          )}
                        >
                          {o.tag}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDone((d) => ({ ...d, [o.id]: o.doneLabel }))
                          }
                          className="rounded-full bg-rust px-4 py-2.5 text-sm font-semibold text-cream ring-1 ring-rust/40"
                        >
                          {o.primary}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDone((d) => ({
                              ...d,
                              [o.id]: "Set aside for now.",
                            }))
                          }
                          className="rounded-full px-4 py-2.5 text-sm font-medium text-inksoft"
                        >
                          {o.secondary}
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>

          <BahiKhata khata={khata} />

          <section className="mt-8 animate-settle">
            <h2 className="font-display text-xl font-semibold">At a glance</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {glance.map((g) => (
                <div
                  key={g.label}
                  className="rounded-[16px] bg-paper p-4 ring-1 ring-line"
                >
                  <p className="text-xs text-inksoft">{g.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    {g.value}
                    {g.suffix && (
                      <small className="text-base text-inksoft">{g.suffix}</small>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-inksoft">{g.note}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="sticky top-0 hidden h-screen w-[360px] shrink-0 flex-col border-l border-line bg-sand/40 lg:flex">
          <CopilotChat shopContext={shopContext} className="h-full" />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-sand/90 px-3 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="mx-auto flex w-full max-w-[1180px] items-center gap-2"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-cream">
            भ
          </span>
          <span className="flex flex-1 items-center gap-2 rounded-full bg-paper px-4 py-2.5 ring-1 ring-line">
            <span className="text-sm text-inksoft/70">
              Ask Bharat about your shop…
            </span>
            <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-rust text-sm text-cream">
              →
            </span>
          </span>
        </button>
      </div>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] gap-0 border-line bg-sand/40 p-0"
        >
          <SheetTitle className="sr-only">Ask Bharat</SheetTitle>
          <CopilotChat shopContext={shopContext} className="h-full" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
