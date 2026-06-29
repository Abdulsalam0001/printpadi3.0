"use client";

import { Button } from "@/components/button";
import { Messages2, ShoppingCart } from "iconsax-reactjs";
import Link from "next/link";

const bottomNavOffset = "5.75rem";

const ctaShellClass =
	"flex min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-full px-3 text-[15px] font-medium normal-case h-12";

export function ProductDetailCtas({ onAddToCart }: { onAddToCart: () => void }) {
	return (
		<div
			className="fixed left-0 right-0 z-40 bg-transparent px-4 py-3 font-bricolage-grotesque"
			style={{
				bottom: `calc(${bottomNavOffset} + env(safe-area-inset-bottom, 0px))`,
			}}
		>
			<div className="flex items-stretch gap-3">
				<Link
					href="/chats"
					className={`${ctaShellClass} border border-black bg-white text-black`}
				>
					<Messages2 size={22} color="#000" />
					<span>Chat Now</span>
				</Link>
				<div className="min-w-0 flex-1 basis-0">
					<Button
						type="button"
						onClick={onAddToCart}
						className={`${ctaShellClass} h-12 w-full bg-black py-0 text-white hover:bg-black`}
					>
						<ShoppingCart size={22} color="#fff" />
						<span>Add To Cart</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
