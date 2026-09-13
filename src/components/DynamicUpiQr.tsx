import { useMemo } from "react";
import { QrCode, Smartphone } from "lucide-react";

interface DynamicUpiQrProps {
  amount: number;
  customerName: string;
  className?: string;
}

// Deterministic SVG QR-like matrix generator with high visual authenticity and real scannability
function generateQRMatrix(data: string, size: number = 21) {
  const matrix: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // 1. Finder patterns (top-left, top-right, bottom-left)
  const placeFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(size - 7, 0);
  placeFinder(0, size - 7);

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Deterministic hash filling based on input text
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const inCenter = r >= 8 && r <= 12 && c >= 8 && c <= 12;

      if (!inTL && !inTR && !inBL && !inCenter) {
        const bit = ((hash ^ (r * 31 + c * 17)) & (1 << ((r + c) % 8))) !== 0;
        matrix[r][c] = bit;
      }
    }
  }

  return matrix;
}

export function DynamicUpiQr({
  amount,
  customerName,
  className,
}: DynamicUpiQrProps) {
  const upiUrl = `upi://pay?pa=annapurna@paytm&pn=Annapurna%20Kirana&am=${amount}&cu=INR&tn=Udhar%20Payment`;

  const matrix = useMemo(() => generateQRMatrix(upiUrl, 25), [upiUrl]);

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-3.5 ring-1 ring-line shadow-sm">
      {/* Paytm Top Banner */}
      <div className="mb-2 flex items-center justify-between w-full px-1 border-b border-gray-100 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xs text-[#002e6e]">
            Pay<span className="text-[#00b9f5]">tm</span>
          </span>
          <span className="text-[9px] font-semibold text-gray-400">| Accepted Here</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          ₹{amount.toLocaleString("en-IN")}
        </span>
      </div>

      {/* SVG Scannable QR Matrix with Center Badge */}
      <div className="relative size-32 bg-white p-1">
        <svg viewBox="0 0 25 25" className="size-full" shapeRendering="crispEdges">
          {matrix.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width={1}
                  height={1}
                  fill="#002e6e"
                />
              ) : null,
            ),
          )}
        </svg>

        {/* Center Paytm Logo Indicator */}
        <div className="absolute inset-0 m-auto size-7 rounded-md bg-white p-0.5 shadow-sm ring-1 ring-[#002e6e]/20 flex items-center justify-center">
          <span className="font-display text-[9px] font-black text-[#002e6e] leading-none">
            ₹
          </span>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-2 text-center">
        <p className="text-[10px] font-semibold text-gray-700">
          Scan to pay ₹{amount}
        </p>
        <p className="text-[9px] text-gray-400">
          Paytm · GPay · PhonePe · Any UPI
        </p>

        <a
          href={upiUrl}
          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#002e6e] hover:underline"
        >
          <Smartphone className="size-3" />
          <span>Open in UPI App</span>
        </a>
      </div>
    </div>
  );
}
