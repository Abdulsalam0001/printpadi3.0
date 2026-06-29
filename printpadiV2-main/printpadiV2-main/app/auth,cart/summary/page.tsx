import { Suspense } from "react";
import { CartSummaryScreen } from "@/features/cart/cart-summary-screen";

export default function CartSummaryPage() {
	return (
		<Suspense fallback={<div className="px-4 py-8 text-center text-sm text-neutral-500">Loading…</div>}>
			<CartSummaryScreen />
		</Suspense>
	);
}
