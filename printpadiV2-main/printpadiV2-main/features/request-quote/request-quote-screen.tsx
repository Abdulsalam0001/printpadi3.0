"use client";

import { type ReactNode, useState } from "react";
import { Box, Call, Edit, Menu, Profile, Sms } from "iconsax-reactjs";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
	ArtworkDesignChoiceField,
	getArtworkDesignLabel,
	type ArtworkDesignChoice,
} from "@/features/request-quote/components/artwork-design-choice";
import { RequestQuoteChrome } from "@/features/request-quote/components/request-quote-chrome";
import {
	buildWhatsAppCustomQuoteMessage,
	buildWhatsAppUrl,
	normalizeWhatsAppPhone,
} from "@/shared/lib/whatsapp";

const fieldInputClassName =
	"w-full rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-neutral-400 focus:border-black";

const CATEGORY_OPTIONS = [
	{ value: "Apparels", label: "Apparels" },
	{ value: "Bags", label: "Bags" },
	{ value: "Business", label: "Business" },
	{ value: "Drinkware", label: "Drinkware" },
	{ value: "Events", label: "Events" },
	{ value: "Gifts", label: "Gifts" },
	{ value: "Packaging", label: "Packaging" },
	{ value: "Pens", label: "Pens" },
	{ value: "Stickers", label: "Stickers" },
];

type QuoteFieldProps = {
	label: string;
	icon: ReactNode;
	children: React.ReactNode;
};

function QuoteField({ label, icon, children }: QuoteFieldProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				{icon}
				<span className="text-[13px] font-semibold text-foreground">{label}</span>
			</div>
			{children}
		</div>
	);
}

export default function RequestQuoteScreen() {
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [productCategory, setProductCategory] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [quantity, setQuantity] = useState("");
	const [artworkDesign, setArtworkDesign] =
		useState<ArtworkDesignChoice>("has_artwork");

	const onSubmit = () => {
		if (
			!fullName.trim() ||
			!phone.trim() ||
			!email.trim() ||
			!productCategory.trim() ||
			!productDescription.trim() ||
			!quantity.trim()
		) {
			toast.error("Please fill in all fields.");
			return;
		}

		const message = buildWhatsAppCustomQuoteMessage({
			fullName,
			phone,
			email,
			productCategory,
			productDescription,
			quantity,
			artworkDesign: getArtworkDesignLabel(artworkDesign),
		});

		const digits = normalizeWhatsAppPhone(
			process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "",
		);
		const href = buildWhatsAppUrl(digits, message);

		if (!href) {
			toast.error(
				"WhatsApp contact is not configured. Set NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER.",
			);
			return;
		}

		window.open(href, "_blank", "noopener,noreferrer");
	};

	return (
		<div
			data-testid="request-quote-screen"
			className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F8F8F8] pb-8 font-[family-name:var(--font-public-sans)]"
		>
			<RequestQuoteChrome />

			<div className="px-4">
				<form
					className="mt-4 space-y-3.5 rounded-[20px] border border-gray-1 bg-white p-4 shadow-sm"
					onSubmit={e => {
						e.preventDefault();
						onSubmit();
					}}
				>
					<QuoteField
						label="Full Name"
						icon={<Profile size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="text"
							name="fullName"
							value={fullName}
							onChange={e => setFullName(e.target.value)}
							className={fieldInputClassName}
							autoComplete="name"
						/>
					</QuoteField>

					<QuoteField
						label="Phone number"
						icon={<Call size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="tel"
							name="phone"
							value={phone}
							onChange={e => setPhone(e.target.value)}
							placeholder="+234 9000000000"
							className={fieldInputClassName}
							autoComplete="tel"
						/>
					</QuoteField>

					<QuoteField
						label="Email Address"
						icon={<Sms size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="email"
							name="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="+234 9000000000"
							className={fieldInputClassName}
							autoComplete="email"
						/>
					</QuoteField>

					<QuoteField
						label="Product Category"
						icon={<Box size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<div className="relative">
							<select
								name="productCategory"
								value={productCategory}
								onChange={e => setProductCategory(e.target.value)}
								className={`${fieldInputClassName} appearance-none pr-10 ${
									!productCategory ? "text-neutral-400" : ""
								}`}
							>
								<option value="" disabled hidden>
									e.g, Corporate T-Shirts
								</option>
								{CATEGORY_OPTIONS.filter(option => option.value).map(option => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<ChevronDown
								size={16}
								className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
								aria-hidden
							/>
						</div>
					</QuoteField>

					<QuoteField
						label="Product description"
						icon={<Edit size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<textarea
							name="productDescription"
							value={productDescription}
							onChange={e => setProductDescription(e.target.value)}
							placeholder="a tshirt..."
							rows={3}
							className="min-h-[80px] w-full resize-none rounded-[15px] border border-neutral-200 bg-white px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-neutral-400 focus:border-black"
						/>
					</QuoteField>

					<QuoteField
						label="Quantity needed"
						icon={<Menu size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="text"
							name="quantity"
							value={quantity}
							onChange={e => setQuantity(e.target.value)}
							placeholder="e.g., 100"
							className={fieldInputClassName}
							inputMode="numeric"
						/>
					</QuoteField>

					<QuoteField
						label="Artwork & Design"
						icon={<Menu size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<ArtworkDesignChoiceField
							value={artworkDesign}
							onChange={setArtworkDesign}
						/>
					</QuoteField>
				</form>

				<button
					type="button"
					onClick={onSubmit}
					data-visual-exclude="true"
					className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white"
				>
					Submit Request
				</button>
			</div>
		</div>
	);
}
