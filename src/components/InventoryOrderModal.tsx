import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKiranaData } from "@/lib/kirana-context";
import { inventoryIntelligenceData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  Phone,
  Send,
  Truck,
} from "lucide-react";

interface InventoryOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessOrder: (msg: string) => void;
}

export function InventoryOrderModal({
  open,
  onOpenChange,
  onSuccessOrder,
}: InventoryOrderModalProps) {
  const { orderInventoryStock } = useKiranaData();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [reorderUnits, setReorderUnits] = useState(24);

  const parle = inventoryIntelligenceData.parleBiscuits;
  const wholesaleTotal = reorderUnits * parle.wholesalePricePerUnit;

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    orderInventoryStock("inv-1", reorderUnits);
    setTimeout(() => {
      setIsOrdering(false);
      setIsOrdered(true);
      onSuccessOrder(
        `Purchase order for ${reorderUnits} units of Parle biscuits sent to Sharma Distributors.`,
      );
    }, 600);
  };

  const handleReset = () => {
    setIsOrdering(false);
    setIsOrdered(false);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setIsOrdering(false);
          setIsOrdered(false);
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="border-line bg-paper sm:max-w-[540px]">
        {!isOrdered ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-amber-500/10 text-amber-700">
                  <Package className="size-4" />
                </span>
                <div>
                  <DialogTitle className="font-display text-xl font-semibold text-ink">
                    Purchase Order Preview
                  </DialogTitle>
                  <DialogDescription className="text-xs text-inksoft">
                    Restock high-velocity inventory before evening chai-rush
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Product Snapshot & Zero Stock Alert */}
            <div className="mt-2 rounded-xl bg-rust/5 p-3.5 ring-1 ring-rust/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-rust/15 px-2 py-0.5 text-[11px] font-semibold text-rust">
                      {parle.stockStatus}
                    </span>
                    <span className="text-[11px] text-rust font-medium">
                      Urgent · Before 5 PM
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-ink">
                    {parle.productName}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-inksoft">Potential lost sales</p>
                  <p className="font-display text-lg font-semibold text-rust">
                    ₹{parle.potentialLostSales.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-rust/15 pt-2.5 text-center text-xs">
                <div>
                  <p className="text-[11px] text-inksoft">Current stock</p>
                  <p className="font-semibold text-rust">0 units</p>
                </div>
                <div>
                  <p className="text-[11px] text-inksoft">Avg daily sales</p>
                  <p className="font-semibold text-ink">18 units</p>
                </div>
                <div>
                  <p className="text-[11px] text-inksoft">Expected evening</p>
                  <p className="font-semibold text-ink">12 units</p>
                </div>
              </div>
            </div>

            {/* Purchase Order Draft Card */}
            <div className="mt-3.5 rounded-2xl bg-cream/70 p-4 ring-1 ring-line">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <div className="flex items-center gap-1.5 text-xs text-inksoft">
                  <FileText className="size-3.5 text-rust" />
                  <span className="font-semibold text-ink">PO Draft: PO-2026-09-PB</span>
                </div>
                <span className="text-[11px] text-inksoft">Today, 2:30 PM</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-inksoft">Supplier:</span>
                  <span className="font-semibold text-ink flex items-center gap-1">
                    <Truck className="size-3 text-rust" />
                    {parle.supplierName} ({parle.supplierPhone})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-inksoft">Recommended Reorder:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReorderUnits((u) => Math.max(12, u - 6))}
                      className="size-6 rounded-md bg-paper font-bold ring-1 ring-line hover:bg-sand"
                    >
                      -
                    </button>
                    <span className="font-bold text-ink w-8 text-center">
                      {reorderUnits}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReorderUnits((u) => u + 6)}
                      className="size-6 rounded-md bg-paper font-bold ring-1 ring-line hover:bg-sand"
                    >
                      +
                    </button>
                    <span className="text-inksoft text-[11px]">units</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-inksoft">Wholesale cost @ ₹20/unit:</span>
                  <span className="font-semibold text-ink">
                    ₹{wholesaleTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-line/70 pt-2 font-medium">
                  <span className="text-ink">Estimated Retail Value:</span>
                  <span className="font-semibold text-emerald">
                    ₹{(reorderUnits * parle.retailPricePerUnit).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex-row items-center justify-between gap-2 border-t border-line pt-3 sm:justify-between">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isOrdering}
                onClick={handlePlaceOrder}
                className="inline-flex items-center gap-1.5 rounded-full bg-rust px-5 py-2.5 text-xs font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="size-3.5" />
                {isOrdering ? "Sending order..." : "Place order with Sharma Dist."}
              </button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center animate-settle">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/5">
              <CheckCircle2 className="size-9" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
              Purchase order dispatched
            </h3>
            <p className="mt-1 text-sm font-medium text-emerald">
              Sharma Distributors confirmed for {reorderUnits} units.
            </p>
            <p className="mx-auto mt-2 max-w-[40ch] text-xs text-inksoft leading-relaxed">
              Expected delivery by <strong>4:15 PM</strong>, well in time for the
              evening rush. Avoided lost sales:{" "}
              <strong>₹{parle.potentialLostSales.toLocaleString("en-IN")}</strong>.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-cream hover:bg-ink/90 active:scale-[0.98]"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
