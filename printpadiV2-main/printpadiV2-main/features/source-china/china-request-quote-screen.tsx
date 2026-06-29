"use client";

import { type ReactNode, useState } from "react";
import { Box, Call, DocumentUpload, Edit, Menu, Profile, Sms } from "iconsax-reactjs";
import { toast } from "sonner";
import { ChinaSourcingChrome } from "@/features/source-china/components/china-sourcing-chrome";
import {
	DesignUpload,
	type DesignUploadValue,
} from "@/features/product/components/design-upload";
import {
	buildWhatsAppQuoteRequestMessage,
	buildWhatsAppUrl,
	normalizeWhatsAppPhone,
} from "@/shared/lib/whatsapp";

const fieldInputClassName =
	"w-full rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-neutral-400 focus:border-black";

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

export default function ChinaRequestQuoteScreen() {
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [productCategory, setProductCategory] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [referenceFile, setReferenceFile] = useState<DesignUploadValue | null>(null);
	const [quantity, setQuantity] = useState("");

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

		const message = buildWhatsAppQuoteRequestMessage({
			fullName,
			phone,
			email,
			productCategory,
			productDescription,
			quantity,
			referenceFileUrl: referenceFile?.url,
			referenceFileName: referenceFile?.fileName,
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
			data-testid="china-request-quote-screen"
			className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F9F9F9] pb-8 font-[family-name:var(--font-public-sans)]"
		>
			<ChinaSourcingChrome />

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
							placeholder="0801 234 5678"
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
							placeholder="example@mail.com"
							className={fieldInputClassName}
							autoComplete="email"
						/>
					</QuoteField>

					<QuoteField
						label="Product Category"
						icon={<Box size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="text"
							name="productCategory"
							value={productCategory}
							onChange={e => setProductCategory(e.target.value)}
							placeholder="e.g, Corporate T-Shirts"
							className={fieldInputClassName}
						/>
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
						label="Reference image"
						icon={
							<DocumentUpload size={16} color="#000" variant="Linear" aria-hidden />
						}
					>
						<DesignUpload
							variant="quote"
							value={referenceFile}
							onChange={setReferenceFile}
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
				</form>

				<button
					type="button"
					onClick={onSubmit}
					className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white"
				>
					Submit Request
				</button>
			</div>
		</div>
	);
}
