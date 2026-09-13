import { useKiranaData } from "./kirana-context";
import type { PaymentMode } from "./khata";

export type NewUdharInput = {
  customer: string;
  phone: string;
  items: string;
  amount: number;
  dueOn: string;
};

export function useKhata() {
  const { khataEntries, totals, addCustomerUdhar, recordCustomerRepayment } = useKiranaData();

  const addEntry = (input: NewUdharInput) => {
    addCustomerUdhar(
      input.customer,
      input.phone,
      input.amount,
      input.items,
      7,
      input.dueOn,
    );
  };

  const addRepayment = (entryId: string, amount: number, mode: PaymentMode) => {
    recordCustomerRepayment(entryId, amount, mode);
  };

  return {
    entries: khataEntries,
    totals,
    addEntry,
    addRepayment,
  };
}
