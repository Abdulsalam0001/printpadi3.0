"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { postOrderLookup, type OrderLookupResult } from "@/shared/api/orders";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";

export function TrackOrderScreen() {
	const searchParams = useSearchParams();
	const [orderCode, setOrderCode] = useState("");
	const [email, setEmail] = useState("");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState<OrderLookupResult | null>(null);
	const autoFetched = useRef(false);

	useEffect(() => {
		const code = searchParams.get("code")?.trim() ?? "";
		const em = searchParams.get("email")?.trim() ?? "";
		if (code) {
			setOrderCode(code);
		}
		if (em) {
			setEmail(em);
		}
	}, [searchParams]);

	const runLookup = useCallback(async (code: string, em: string) => {
		if (!code || !em) {
			return;
		}
		setBusy(true);
		setResult(null);
		try {
			const order = await postOrderLookup(code, em);
			setResult(order);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Lookup failed.");
		} finally {
			setBusy(false);
		}
	}, []);

	useEffect(() => {
		const code = searchParams.get("code")?.trim() ?? "";
		const em = searchParams.get("email")?.trim() ?? "";
		if (!code || !em || autoFetched.current) {
			return;
		}
		autoFetched.current = true;
		void runLookup(code, em);
	}, [searchParams, runLookup]);

	const onLookup = () => {
		void runLookup(orderCode.trim(), email.trim());
	};

	return (
		<div className="min-h-[calc(100vh-5rem)] bg-gray-6 px-4 pb-24 pt-5 font-sans">
			<Link href="/profile" className="mb-4 inline-block text-sm text-neutral-600 underline">
				← Profile
			</Link>
			<h1 className="font-bricolage-grotesque text-xl font-semibold text-foreground">Track order</h1>
			<p className="mt-1 text-sm text-neutral-600">
				Use the order code from your confirmation email (starts with{" "}
				<span className="font-mono">padi-</span>).
			</p>

			<div className="mt-6 space-y-3 rounded-[20px] border border-gray-1 bg-white p-4 shadow-sm">
				<input
					type="text"
					placeholder="Order code (e.g. padi-…)"
					value={orderCode}
					onChange={e => setOrderCode(e.target.value)}
					className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
				/>
				<input
					type="email"
					placeholder="Email used at checkout"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
				/>
				<Button
					type="button"
					className="w-full rounded-full py-3"
					disabled={busy}
					onClick={onLookup}
				>
					{busy ? "Looking up…" : "Find order"}
				</Button>
			</div>

			{result ? (
				<div className="mt-6 space-y-4 rounded-[20px] border border-gray-1 bg-white p-4 shadow-sm">
					<div className="flex flex-wrap items-baseline justify-between gap-2">
						<p className="font-mono text-sm font-medium">{result.orderCode}</p>
						<p className="text-xs uppercase text-neutral-500">{result.paymentStatus}</p>
					</div>
					<p className="text-sm text-neutral-600">
						Placed {new Date(result.createdAt).toLocaleString()}
					</p>
					<p className="font-bricolage-grotesque text-lg font-semibold">
						Total {result.currency}{" "}
						{formatNaira(Number.parseFloat(result.total || "0") || 0)}
					</p>
					<ul className="divide-y divide-neutral-100 border-t border-neutral-100 pt-3">
						{result.items.map((line, i) => (
							<li key={i} className="flex justify-between gap-2 py-2 text-sm">
								<span className="text-neutral-800">
									{line.productName} × {line.quantity}
								</span>
								<span className="shrink-0 font-medium">
									{formatNaira(Number.parseFloat(line.lineTotal || "0") || 0)}
								</span>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}
