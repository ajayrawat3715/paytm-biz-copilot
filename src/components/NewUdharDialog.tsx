import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { istDaysFromToday, istToday } from "@/lib/khata";
import type { NewUdharInput } from "@/lib/use-khata";

export function NewUdharDialog({
  onCreate,
}: {
  onCreate: (input: NewUdharInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  const [dueOn, setDueOn] = useState(istDaysFromToday(7));

  const valid = customer.trim() && Number(amount) > 0 && dueOn;

  const submit = () => {
    if (!valid) return;
    onCreate({
      customer: customer.trim(),
      phone: phone.trim(),
      items: items.trim() || "Shop items",
      amount: Number(amount),
      dueOn,
    });
    setCustomer("");
    setPhone("");
    setItems("");
    setAmount("");
    setDueOn(istDaysFromToday(7));
    setOpen(false);
  };

  const field =
    "mt-1 w-full rounded-xl bg-cream px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-line placeholder:text-inksoft/50 focus:ring-rust";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-full bg-rust px-4 py-2.5 text-sm font-semibold text-cream ring-1 ring-rust/40">
        New udhar
      </DialogTrigger>
      <DialogContent className="border-line bg-paper sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-ink">
            Give udhar
          </DialogTitle>
          <DialogDescription className="text-sm text-inksoft">
            Note down a credit sale. It goes straight into today's bahi-khata.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-inksoft" htmlFor="cust">
              Customer name
            </label>
            <input
              id="cust"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Lakshmi Devi"
              className={field}
            />
          </div>
          <div>
            <label className="text-xs text-inksoft" htmlFor="ph">
              Phone (for WhatsApp receipts)
            </label>
            <input
              id="ph"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98350 41122"
              className={field}
            />
          </div>
          <div>
            <label className="text-xs text-inksoft" htmlFor="items">
              What did they take?
            </label>
            <input
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Atta 10kg, oil, masala"
              className={field}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-inksoft" htmlFor="amt-new">
                Amount
              </label>
              <input
                id="amt-new"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="2400"
                className={field}
              />
            </div>
            <div>
              <label className="text-xs text-inksoft" htmlFor="due">
                Expected payment
              </label>
              <input
                id="due"
                type="date"
                min={istToday()}
                value={dueOn}
                onChange={(e) => setDueOn(e.target.value)}
                className={field}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!valid}
          className="mt-2 w-full rounded-full bg-rust px-4 py-3 text-sm font-semibold text-cream ring-1 ring-rust/40 disabled:opacity-40"
        >
          Save to bahi-khata
        </button>
      </DialogContent>
    </Dialog>
  );
}
