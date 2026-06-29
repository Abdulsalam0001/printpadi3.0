import Link from "next/link";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "@/shared/lib/whatsapp";

export default function ChatsPage() {
	const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "";
	const digits = normalizeWhatsAppPhone(raw);
	const href = buildWhatsAppUrl(digits, "Hello PrintPadi!");

	return (
		<div className="mx-auto max-w-md px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-2xl font-semibold text-foreground">Chats</h1>
			<p className="mt-3 text-sm text-gray-5">
				Reach PrintPadi on WhatsApp for order questions and support.
			</p>
			{href ? (
				<Link
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
				>
					Open WhatsApp
				</Link>
			) : (
				<p className="mt-8 text-sm text-gray-5">
					WhatsApp is not configured. Set{" "}
					<code className="rounded bg-gray-6 px-1 py-0.5 text-xs">NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER</code>{" "}
					in your environment.
				</p>
			)}
		</div>
	);
}
