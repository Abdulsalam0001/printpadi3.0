"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Location } from "iconsax-reactjs";
import { Button } from "@/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/features/cart/store/cart-store";
import { postCheckoutOrder } from "@/shared/api/orders";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";

export function CartSummaryScreen() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const items = useCartStore(s => s.cart.items);
	const clearCart = useCartStore(s => s.clearCart);
	const [tab, setTab] = useState("summary");

	useEffect(() => {
		if (searchParams.get("tab") === "delivery") {
			setTab("delivery");
		}
	}, [searchParams]);
	const [guestEmail, setGuestEmail] = useState("");
	const [guestPhone, setGuestPhone] = useState("");
	const [guestFullName, setGuestFullName] = useState("");
	const [deliveryLocation, setDeliveryLocation] = useState("");
	const [busy, setBusy] = useState(false);

	const lines = useMemo(
		() =>
			items.map(item => ({
				productId: item.productId,
				quantity: item.quantity,
				colorId: item.options?.colorId,
				colorHex: item.options?.colorHex,
				colorName: item.options?.color,
				sizeOptionId: item.options?.sizeOptionId,
				sizeLabel: item.options?.size,
				choiceSelections: item.options?.choiceSelections,
				designMethod: item.options?.designMethod,
				designFileUrl: item.options?.designFileUrl,
				designFilePublicId: item.options?.designFilePublicId,
				designFileName: item.options?.designFileName,
			})),
		[items],
	);

	const onPlaceOrder = async () => {
		if (!guestEmail.trim() || !guestPhone.trim() || !guestFullName.trim()) {
			toast.error("Please enter your name, email, and phone.");
			return;
		}
		if (!lines.length) {
			toast.error("Your cart is empty.");
			return;
		}
		setBusy(true);
		try {
			const order = await postCheckoutOrder({
				guestEmail: guestEmail.trim(),
				guestPhone: guestPhone.trim(),
				guestFullName: guestFullName.trim(),
				deliveryLocation: deliveryLocation.trim() || undefined,
				lines,
			});
			clearCart();
			toast.success(`Order ${order.orderCode} placed successfully.`);
			router.push(
				`/profile/track-order?code=${encodeURIComponent(order.orderCode)}&email=${encodeURIComponent(guestEmail.trim())}`,
			);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Checkout failed.");
		} finally {
			setBusy(false);
		}
	};

	/** Height of app bottom nav (layout.tsx) — keep CTAs above it */
	const bottomNavOffset = "5.75rem";

	return (
		<div
			data-testid="cart-summary-screen"
			className="flex min-h-[calc(100vh-4rem)] flex-col bg-white px-4 pt-4 font-sans"
			style={{
				paddingBottom: `calc(${bottomNavOffset} + 5.5rem + env(safe-area-inset-bottom, 0px))`,
			}}
		>
			<header className="mb-4 flex items-center justify-center">
				<h1 className="text-center font-bricolage-grotesque text-[17px] font-semibold text-foreground">
					Cart Summary
				</h1>
			</header>

			<Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
				<TabsList
					variant="line"
					className="mb-4 grid h-auto w-full grid-cols-2 gap-0 rounded-none border-0 bg-transparent p-0 font-bricolage-grotesque"
				>
					<TabsTrigger
						value="summary"
						data-testid="cart-summary-tab-summary"
						className="py-2 text-[13px] font-semibold text-neutral-500 data-active:text-black"
					>
						Your Summary
					</TabsTrigger>
					<TabsTrigger
						value="delivery"
						data-testid="cart-summary-tab-delivery"
						className="py-2 text-[13px] font-semibold text-neutral-500 data-active:text-black"
					>
						Delivery &amp; Payment
					</TabsTrigger>
				</TabsList>

				<TabsContent value="summary" className="mt-0 flex-1">
					<div className="space-y-3 rounded-[12px] border border-[#F3F4F6] bg-white p-3 shadow-sm">
						{items.length === 0 ? (
							<p className="py-6 text-center text-sm text-neutral-500">Your cart is empty.</p>
						) : (
							items.map(item => (
								<div key={item.id} className="flex gap-3 border-b border-[#F3F4F6] py-3 last:border-b-0">
									<div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
										<Image
											src={item.image}
											alt=""
											fill
											className="object-cover"
											sizes="72px"
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-bricolage-grotesque text-[15px] font-medium leading-tight text-[#1E2939]">
											{item.name}
										</p>
										<p className="mt-0.5 text-[10px] italic text-neutral-500">
											{item.quantity}pcs
										</p>
									</div>
									<div className="shrink-0 text-right">
										<p className="font-bricolage-grotesque text-[15px] font-semibold text-[#1E2939]">
											NGN {formatNaira(item.unitPrice.amount * item.quantity)}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</TabsContent>

				<TabsContent value="delivery" className="mt-0 flex-1 space-y-6">
					<div className="rounded-[12px] border border-[#F3F4F6] bg-white p-4 shadow-sm">
						<h2 className="mb-3 font-bricolage-grotesque text-[15px] font-semibold text-foreground">
							Contact
						</h2>
						<div className="space-y-3">
							<input
								type="text"
								placeholder="Full name"
								value={guestFullName}
								onChange={e => setGuestFullName(e.target.value)}
								className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
							/>
							<input
								type="email"
								placeholder="Email"
								value={guestEmail}
								onChange={e => setGuestEmail(e.target.value)}
								className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
							/>
							<input
								type="tel"
								placeholder="Phone"
								value={guestPhone}
								onChange={e => setGuestPhone(e.target.value)}
								className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
							/>
						</div>
					</div>

					<div className="rounded-[12px] border border-[#F3F4F6] bg-white p-4 shadow-sm">
						<h2 className="mb-3 font-bricolage-grotesque text-[15px] font-semibold text-foreground">
							Delivery Details
						</h2>
						<div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
							<Location size={20} variant="Linear" className="shrink-0 text-neutral-500" />
							<input
								type="text"
								placeholder="Location"
								value={deliveryLocation}
								onChange={e => setDeliveryLocation(e.target.value)}
								className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
							/>
						</div>
					</div>

					<div className="rounded-[12px] border border-[#F3F4F6] bg-white p-4 shadow-sm">
						<h2 className="mb-2 font-bricolage-grotesque text-[15px] font-semibold text-foreground">
							Confirm
						</h2>
						<p className="mb-4 text-sm text-neutral-600">
							Payment is not required in this build. Place your order to save it to our system.
						</p>
						<Button
							type="button"
							data-testid="cart-summary-place-order-inline"
							className="h-12 w-full rounded-full bg-black font-bricolage-grotesque text-[15px] font-medium text-white"
							disabled={busy || !items.length}
							onClick={() => void onPlaceOrder()}
						>
							{busy ? "Please wait…" : "Place order"}
						</Button>
					</div>
				</TabsContent>
			</Tabs>

			<div
				data-testid="cart-summary-footer"
				className="fixed inset-x-0 z-[60] border-t border-neutral-100 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
				style={{
					bottom: `calc(${bottomNavOffset} + env(safe-area-inset-bottom, 0px))`,
				}}
			>
				{tab === "summary" ? (
					<Button
						type="button"
						className="h-12 w-full rounded-full bg-black font-bricolage-grotesque text-[15px] font-medium text-white"
						disabled={!items.length}
						onClick={() => setTab("delivery")}
					>
						Proceed
					</Button>
				) : (
					<Button
						type="button"
						className="h-12 w-full rounded-full bg-black font-bricolage-grotesque text-[15px] font-medium text-white"
						disabled={busy}
						onClick={() => void onPlaceOrder()}
					>
						{busy ? "Please wait…" : "Place order"}
					</Button>
				)}
			</div>
		</div>
	);
}
