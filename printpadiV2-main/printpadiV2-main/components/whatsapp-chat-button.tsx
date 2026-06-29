"use client";

import { Button } from "@/components/button";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "@/shared/lib/whatsapp";
import { toast } from "sonner";

const DEFAULT_MISSING_PHONE_MESSAGE =
	"WhatsApp contact is not configured. Set NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER.";

export type WhatsAppChatButtonProps = {
	/** Full message body sent as prefilled WhatsApp text */
	message: string;
	/**
	 * Raw phone value (digits, +234, spaces OK). If omitted, uses
	 * NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER from the client bundle.
	 */
	phoneNumber?: string;
	label?: string;
	className?: string;
	disabled?: boolean;
	/** Override toast when phone is missing or invalid after normalization */
	missingPhoneMessage?: string;
};

export const WhatsAppChatButton = ({
	message,
	phoneNumber,
	label = "Chat on WhatsApp",
	className,
	disabled = false,
	missingPhoneMessage = DEFAULT_MISSING_PHONE_MESSAGE,
}: WhatsAppChatButtonProps) => {
	const raw =
		phoneNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "";
	const digits = normalizeWhatsAppPhone(raw);
	const href = buildWhatsAppUrl(digits, message);

	return (
		<Button
			type="button"
			className={className}
			disabled={disabled}
			onClick={() => {
				if (!href) {
					toast.error(missingPhoneMessage);
					return;
				}
				window.open(href, "_blank", "noopener,noreferrer");
			}}
		>
			{label}
		</Button>
	);
};
