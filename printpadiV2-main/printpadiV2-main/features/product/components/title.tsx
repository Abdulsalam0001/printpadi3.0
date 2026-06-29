import { Product } from "@/lib/products";
import { formatNaira } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Title = ({ details }: { details: Product }) => {
	const primaryImageOrFallback = details.images?.[0] || "/shirts.svg";
	const prices = Array.isArray(details.price) && details.price.length > 0 ? details.price : [0];
	const minPrice = prices[0] ?? 0;
	const bulkDisplayPrice =
		details.basePrice && details.basePrice > 0 ? details.basePrice : minPrice;
	const displayStock = details.totalStockCount ?? details.stock ?? 0;

	return (
		<div className="font-sans px-4 mt-4.75">
			<div className="px-4 pt-6 pb-3.25 rounded-[15px] flex justify-center items-center bg-[#AAAAAA0D] border-[0.06px] border-gray-1">
				<Image src={primaryImageOrFallback} alt="" width={174} height={174} />
			</div>
			<div className="px-4 pt-6 pb-3.25 rounded-[15px] border-[0.06px] border-gray-1 mt-9.75 box-shadow">
				<h3 className="text-[20px] text-[#1E2939] font-bold">
					{details.name}
				</h3>
				<h3 className="text-[30px] font-bold mt-3">
					₦{formatNaira(details.type === "bulk" ? bulkDisplayPrice : minPrice)}{" "}
					<span className="text-[14px] text-[#6A7282] font-normal">
						per piece
					</span>
				</h3>
				<p className="text-[#4A5565] text-[14px] font-normal mt-3">
					{details.type === "bulk"
						? `MOQ: ${details.moq ?? 10} pcs`
						: `${displayStock} pcs in stock`}
				</p>
				<p className="text-[#4A5565] text-[14px] font-normal mt-4">
					{details.description ?? "No product description available yet."}
				</p>
			</div>
		</div>
	);
};

export default Title;
