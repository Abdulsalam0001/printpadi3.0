"use client";
import { Button } from "@/components/button";
import { Product } from "@/lib/products";
import {
	AddCircle,
	Messages2,
	MinusCirlce,
	ShoppingCart,
} from "iconsax-reactjs";
import React, { useState } from "react";
import { useCartStore } from "@/features/cart/store/cart-store";

const Options = ({ details }: { details: Product }) => {
	const colorOptions = details.colors ?? [];
	const sizeOptions = details.sizeScale?.options ?? [];
	const customizationGroups = details.optionGroups?.customizations ?? [];
	const designOptionGroups = details.optionGroups?.designOptions ?? [];
	const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
	const [selectedSize, setSelectedSize] = useState(
		sizeOptions.find(option => option.id === details.sizeScale?.defaultOptionId) ??
			sizeOptions[0],
	);
	const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() => {
		const requiredGroups = [...customizationGroups, ...designOptionGroups];
		return requiredGroups.reduce<Record<string, string>>((acc, group) => {
			if (group.isRequired && group.choices[0]?.id) {
				acc[group.id] = group.choices[0].id;
			}
			return acc;
		}, {});
	});
	const [quantity, setQuantity] = useState(10);
	const addItem = useCartStore(state => state.addItem);

	return (
		<form className="px-4 mt-5.5">
			<div className="px-4 pt-6 pb-3.25 rounded-[15px] border-[0.06px] border-gray-1 mb-30 box-shadow">
				{details.type == "retail" && colorOptions.length > 0 && (
					<>
						<div className="mb-13">
							<h3 className="font-medium capitalize text-[15px] mb-2.75">
								Color:
							</h3>
							<div className="flex items-center space-x-3.75">
								{colorOptions.map((opt, i) => (
									<label
										key={opt.id || i}
										className="flex items-center space-x-3 cursor-pointer"
									>
										<input
											type="radio"
											name="color"
											value={opt.id}
											checked={selectedColor?.id === opt.id}
											onChange={() => setSelectedColor(opt)}
											className="hidden peer"
										/>

										<div className="flex justify-center items-center p-[1.24px] rounded-full peer-checked:border-[0.19px] peer-checked:border-[#000000]">
											<div
												style={{ backgroundColor: opt.hexValue }}
												className="h-5 w-5 rounded-full"
											></div>
										</div>
									</label>
								))}
							</div>
						</div>
						{sizeOptions.length > 0 && (
							<div className="mb-13">
								<h3 className="font-medium capitalize text-[15px] mb-2.75">
									{details.sizeScale?.name ?? "Size"}:
								</h3>
								<div className="flex items-center space-x-3.75">
									{sizeOptions.map((opt, i) => (
										<label
											key={opt.id || i}
											className="flex items-center space-x-3 cursor-pointer"
										>
											<input
												type="radio"
												name="size"
												value={opt.id}
												checked={selectedSize?.id === opt.id}
												onChange={() => setSelectedSize(opt)}
												className="hidden peer"
											/>

											<div className="flex justify-center items-center text-[13px] h-8.75 w-8.75 p-2.25 rounded-full text-[#AAAAAA] uppercase border-[0.5px] border-[#AAAAAA] peer-checked:bg-[#000000] peer-checked:text-white">
												{opt.label}
											</div>
										</label>
									))}
								</div>
							</div>
						)}
					</>
				)}
				{customizationGroups.map(group => (
					<div className="mb-13" key={group.id}>
						<h3 className="font-medium capitalize text-[15px] mb-2.75">
							{group.name}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.choices.map(choice => (
								<button
									type="button"
									key={choice.id}
									className="cursor-pointer"
									onClick={() => {
										const defaultChoiceId = group.isRequired
											? group.choices[0]?.id
											: undefined;
										const currentChoiceId =
											selectedChoices[group.id] ?? defaultChoiceId;
										if (!group.isRequired && currentChoiceId === choice.id) {
											setSelectedChoices(current => {
												const next = { ...current };
												delete next[group.id];
												return next;
											});
											return;
										}
										setSelectedChoices(current => ({
											...current,
											[group.id]: choice.id,
										}));
									}}
								>
									<input
										type="radio"
										name={`customization-${group.id}`}
										value={choice.id}
										checked={
											(
												selectedChoices[group.id] ??
												(group.isRequired ? group.choices[0]?.id : undefined)
											) === choice.id
										}
										onChange={() => {}}
										className="hidden peer"
									/>
									<div className="text-[13px] rounded-full border-[0.5px] border-[#AAAAAA] px-3 py-2 text-[#AAAAAA] peer-checked:bg-[#000000] peer-checked:text-white">
										{choice.label}
										{choice.displayPriceAdjustment &&
											` (${choice.displayPriceAdjustment})`}
									</div>
								</button>
							))}
						</div>
					</div>
				))}
				{designOptionGroups.map(group => (
					<div className="mb-13" key={group.id}>
						<h3 className="font-medium capitalize text-[15px] mb-2.75">
							{group.name}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.choices.map(choice => (
								<label key={choice.id} className="cursor-pointer">
									<input
										type="radio"
										name={`design-${group.id}`}
										value={choice.id}
										checked={
											(selectedChoices[group.id] ?? group.choices[0]?.id) ===
											choice.id
										}
										onChange={() =>
											setSelectedChoices(current => ({
												...current,
												[group.id]: choice.id,
											}))
										}
										className="hidden peer"
									/>
									<div className="text-[13px] rounded-full border-[0.5px] border-[#AAAAAA] px-3 py-2 text-[#AAAAAA] peer-checked:bg-[#000000] peer-checked:text-white">
										{choice.label}
										{choice.displayPriceAdjustment &&
											` (${choice.displayPriceAdjustment})`}
									</div>
								</label>
							))}
						</div>
					</div>
				))}
				{/* <div>
					<h3 className="font-medium capitalize text-xs mb-2.75">
						Customization <span className="text-gray-4">(Optional)</span>
					</h3>
				</div> */}
				<div>
					<h3 className="font-medium capitalize text-[15px] mb-2.75">
						Quantity
					</h3>
					<div className="border-[0.2px] border-black px-3 py-1.5 rounded-[30px] flex justify-between items-center w-full max-w-36">
						<Button
							className="bg-white p-0"
							onClick={() => setQuantity(current => Math.max(1, current - 1))}
						>
							<MinusCirlce size="16" color="#000000" />
						</Button>
						<div className="flex justify-center">
							<input
								value={quantity}
								onChange={event =>
									setQuantity(
										Math.max(1, Number.parseInt(event.target.value || "1", 10)),
									)
								}
								className="text-[15px] font-normal max-w-8.75 text-center"
							/>
						</div>
						<Button
							className="bg-white p-0"
							onClick={() => setQuantity(current => current + 1)}
						>
							<AddCircle size="16" color="#000000" />
						</Button>
					</div>
				</div>
			</div>
			<div className="fixed bottom-0 left-4 right-4 flex items-center justify-between space-x-5.5 font-bricolage-grotesque">
				<Button className="flex-1 flex items-center justify-center space-x-2.5 font-medium bg-white text-black border-[0.5px] border-[#000000] text-[15px] py-3.75 rounded-[30px] mt-10 mb-8">
					<Messages2 size="24" color="#000" />
					<span>Chat Now</span>
				</Button>
				<Button
					className="flex-1 flex items-center justify-center space-x-2.5 font-medium text-[15px] py-3.75 rounded-[30px] mt-10 mb-8"
					onClick={() =>
						addItem({
							product: details,
							quantity,
							options:
								details.type === "retail"
									? {
											color: selectedColor?.name,
											colorId: selectedColor?.id,
											colorHex: selectedColor?.hexValue,
											size: selectedSize?.label,
											sizeOptionId: selectedSize?.id,
											choiceSelections: selectedChoices,
										}
									: {
											choiceSelections: selectedChoices,
										},
						})
					}
				>
					<ShoppingCart size="24" color="#fff" />
					<span>Add To Cart</span>
				</Button>
			</div>
		</form>
	);
};

export default Options;
