"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { AddCircle, MinusCirlce, Trash } from "iconsax-reactjs";
import { Button } from "@/components/button";
import { useCartStore } from "@/features/cart/store/cart-store";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";

const CartPage = () => {
	const items = useCartStore(state => state.cart.items);
	const subtotalAmount = useCartStore(state => {
		return state.cart.items.reduce(
			(sum, item) => sum + item.unitPrice.amount * item.quantity,
			0,
		);
	});
	const incrementItem = useCartStore(state => state.incrementItem);
	const decrementItem = useCartStore(state => state.decrementItem);
	const removeItem = useCartStore(state => state.removeItem);

	return (
		<div className="py-10.75 px-4">
			<Tabs defaultValue="cart" className="w-full flex flex-col mx-0 px-0">
				<TabsList
					className={
						"w-full h-auto min-h-11 bg-[#F3F4F6] px-2.5 py-2 rounded-[34px] font-bricolage-grotesque font-semibold text-[12px]"
					}
				>
					<TabsTrigger value="cart">My Cart</TabsTrigger>
					<TabsTrigger value="ongoing">Ongoing</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
				</TabsList>
				<TabsContent value="cart">
					{items.length === 0 && (
						<div className="border-[1.4px] border-[#F3F4F6] rounded-[11.14px] cart-box-shadow px-3.5 py-8 text-center">
							<p className="font-sans text-sm text-gray-4">
								Your cart is empty. Add products from home or product pages.
							</p>
						</div>
					)}
					<div className="flex flex-col gap-4">
						{items.map(item => (
							<div
								key={item.id}
								className="flex items-start space-x-2.5 border-[1.4px] border-[#F3F4F6] rounded-[11.14px] cart-box-shadow px-3.5 py-5"
							>
								<div className="w-full max-w-27.5">
									<Image
										src={item.image}
										alt={item.name}
										height={106}
										width={106}
										priority
										className={"rounded-[11.14px]"}
									/>
								</div>
								<div className="flex flex-col gap-1 w-full">
									<div className="flex justify-between items-center">
										<div>
											<h2 className="text-[#1E2939] font-medium text-[15px] font-bricolage-grotesque leading-tight mb-0">
												{item.name}
											</h2>
										</div>
										<button
											type="button"
											onClick={() => removeItem(item.id)}
											aria-label={`Remove ${item.name} from cart`}
											className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/35"
										>
											<Trash variant="Outline" size={18} aria-hidden />
										</button>
									</div>
									<div className="flex justify-between items-end">
										<div className="flex flex-col gap-0.5">
											<p className="text-[10px] font-normal font-sans italic text-gray-4 leading-tight m-0">
												{item.quantity} pcs × ₦{formatNaira(item.unitPrice.amount)}
											</p>
											<h3 className="text-[#1E2939] font-semibold text-[15px] font-bricolage-grotesque leading-tight mt-0 mb-0">
												₦{formatNaira(item.quantity * item.unitPrice.amount)}
											</h3>
										</div>
										<div className="w-full max-w-36">
											<div className="border-[0.2px] border-black px-3 py-1.5 rounded-[30px] flex justify-between items-center w-full max-w-36">
												<Button
													className="bg-white p-0"
													onClick={() => {
														if (item.quantity <= (item.minQuantity ?? 1)) {
															toast.info(
																`Minimum quantity is ${item.minQuantity ?? 1} pcs.`,
															);
															return;
														}
														decrementItem(item.id);
													}}
												>
													<MinusCirlce size="16" color="#000000" />
												</Button>
												<div className="flex justify-center text-[15px] font-normal max-w-8.75 text-center">
													{item.quantity}
												</div>
												<Button
													className="bg-white p-0"
													onClick={() => {
														if (
															item.maxQuantity != null &&
															item.quantity >= item.maxQuantity
														) {
															toast.info(
																`Maximum available is ${item.maxQuantity} pcs.`,
															);
															return;
														}
														incrementItem(item.id);
													}}
												>
													<AddCircle size="16" color="#000000" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-4 rounded-[11.14px] border-[1.4px] border-[#F3F4F6] px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-sans text-xs text-gray-4">Subtotal</span>
							<span className="font-semibold text-[15px]">
								₦{formatNaira(subtotalAmount)}
							</span>
						</div>
					</div>
					{items.length > 0 ? (
						<div className="mt-4 pb-24">
							<Link
								href="/cart/summary?tab=delivery"
								className="flex h-12 w-full items-center justify-center rounded-full bg-black font-bricolage-grotesque text-[15px] font-medium text-white"
							>
								checkout
							</Link>
						</div>
					) : null}
				</TabsContent>
				<TabsContent value="ongoing">
					<div className="flex items-start space-x-2.5 border-[1.4px] border-[#F3F4F6] rounded-[11.14px] cart-box-shadow px-3.5 py-5">
						<div className="flex flex-col gap-1 w-full">
							<div className="flex justify-between items-center">
								<div className="flex flex-col gap-0.5">
									<h2 className="text-[10px] font-normal font-sans text-gray-4 leading-tight m-0">
										ORD-2024-1234
									</h2>
									<h3 className="text-[#1E2939] font-bold text-[16px] font-bricolage-grotesque leading-tight mt-0 mb-0">
										₦200,000
									</h3>
								</div>
								<div>
									<Button className="font-bricolage-grotesque font-medium text-[12px] py-1.75 px-4.75 text-[#1447E6] bg-[#DBEAFE]">
										In Transit
									</Button>
								</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="flex flex-col gap-0.5">
									<p className="text-[10px] font-normal font-sans text-gray-4 leading-tight m-0">
										Total
									</p>
									<h3 className="text-[#1E2939] font-bold text-[16px] font-bricolage-grotesque leading-tight mt-0 mb-0">
										₦200,000
									</h3>
								</div>
								<div>
									<Link
										href="/profile/track-order"
										className="inline-flex items-center justify-center rounded-full font-bricolage-grotesque font-medium text-[12px] py-1.75 px-4.75 bg-white border border-neutral-200"
									>
										Track Order
									</Link>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="completed">completed</TabsContent>
			</Tabs>
		</div>
	);
};

export default CartPage;
