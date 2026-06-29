"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	ArrowDown2,
	DocumentText,
	Global,
	Heart,
	MessageQuestion,
	MessageText1,
	Messages2,
	Profile as ProfileUserIcon,
} from "iconsax-reactjs";
import {
	fetchAuthMeOptional,
	postAuthLogout,
	type AuthUser,
} from "@/shared/api/auth";
import { useFavoritesStore } from "@/features/favorites/favorites-store";
import { normalizeWhatsAppPhone } from "@/shared/lib/whatsapp";
import { cn } from "@/lib/utils";

const iconMuted = "#6A7282";
const iconSize = 22;

const WhatsAppGlyph = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
		<path
			fill="#25D366"
			d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.113 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
		/>
	</svg>
);

const XGlyph = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
		<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);

const InstagramGlyph = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
		<defs>
			<linearGradient id="profileIgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
				<stop offset="0%" stopColor="#F58529" />
				<stop offset="50%" stopColor="#DD2A7B" />
				<stop offset="100%" stopColor="#8134AF" />
			</linearGradient>
		</defs>
		<path
			fill="url(#profileIgGradient)"
			d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
		/>
	</svg>
);

const LinkedInGlyph = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
		<path
			fill="#0A66C2"
			d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
		/>
	</svg>
);

type AccordionProps = {
	title: string;
	icon: ReactNode;
	open: boolean;
	onToggle: () => void;
	children: ReactNode;
};

const AccordionSection = ({ title, icon, open, onToggle, children }: AccordionProps) => (
	<div className="border-b border-gray-1 last:border-b-0">
		<button
			type="button"
			onClick={onToggle}
			className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
		>
			<span className="flex items-center gap-3">
				<span className="flex w-7 shrink-0 justify-center text-foreground">{icon}</span>
				<span className="text-[15px] font-medium text-foreground">{title}</span>
			</span>
			<ArrowDown2
				size={18}
				color={iconMuted}
				className={cn("shrink-0 transition-transform", open && "rotate-180")}
			/>
		</button>
		{open ? <div className="border-t border-gray-1 bg-gray-6/60 px-2 pb-2 pt-1">{children}</div> : null}
	</div>
);

const SubLink = ({
	href,
	label,
	external,
	icon,
}: {
	href: string;
	label: string;
	external?: boolean;
	icon?: ReactNode;
}) => (
	<Link
		href={href}
		{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		className="flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] text-foreground hover:bg-white/80"
	>
		{icon ? <span className="flex w-7 shrink-0 justify-center">{icon}</span> : <span className="w-7" />}
		<span>{label}</span>
	</Link>
);

const MenuLinkRow = ({
	href,
	icon,
	label,
	external,
}: {
	href: string;
	icon: ReactNode;
	label: string;
	external?: boolean;
}) => (
	<Link
		href={href}
		{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		className="flex items-center justify-between gap-3 border-b border-gray-1 px-4 py-4 last:border-b-0"
	>
		<span className="flex items-center gap-3">
			<span className="flex w-7 shrink-0 justify-center text-foreground">{icon}</span>
			<span className="text-[15px] font-medium text-foreground">{label}</span>
		</span>
		<ArrowDown2 size={18} color={iconMuted} className="-rotate-90 shrink-0" />
	</Link>
);

export function ProfileScreen() {
	const [quickOpen, setQuickOpen] = useState(true);
	const [socialOpen, setSocialOpen] = useState(true);
	const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(undefined);
	const [logoutError, setLogoutError] = useState<string | null>(null);
	const [logoutBusy, setLogoutBusy] = useState(false);

	const waDigits = normalizeWhatsAppPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "");
	const whatsappHref = waDigits ? `https://wa.me/${waDigits}` : "https://wa.me/";

	const refreshSession = useCallback(async () => {
		try {
			const user = await fetchAuthMeOptional();
			setAuthUser(user);
		} catch {
			setAuthUser(null);
		}
	}, []);

	useEffect(() => {
		void refreshSession();
	}, [refreshSession]);

	const onLogout = async () => {
		setLogoutError(null);
		setLogoutBusy(true);
		try {
			await postAuthLogout();
			setAuthUser(null);
			useFavoritesStore.getState().rehydrateGuestAfterLogout();
		} catch (e) {
			setLogoutError(e instanceof Error ? e.message : "Could not sign out.");
		} finally {
			setLogoutBusy(false);
		}
	};

	return (
		<div
			data-testid="profile-screen"
			className="min-h-[calc(100vh-5rem)] bg-gray-6 px-4 pb-32 pt-5 font-sans"
		>
			<section className="rounded-[20px] border border-gray-1 bg-white p-4 shadow-sm">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-4">
						<div
							className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gray-1"
							aria-hidden
						>
							<ProfileUserIcon size={36} color={iconMuted} variant="Bold" />
						</div>
						{authUser === undefined ? (
							<div
								className="h-11 min-h-11 flex-1 animate-pulse rounded-full bg-gray-1"
								aria-hidden
							/>
						) : authUser ? (
							<div className="flex min-h-11 flex-1 flex-col justify-center gap-0.5 text-left">
								<p className="text-[15px] font-semibold leading-tight text-foreground">
									{authUser.name?.trim() || "Signed in"}
								</p>
								<p className="truncate text-xs text-gray-5">{authUser.email}</p>
							</div>
						) : (
							<Link
								href="/auth/login"
								className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-foreground px-4 text-center text-[14px] font-semibold text-background"
							>
								Sign in or Register
							</Link>
						)}
					</div>
					{authUser ? (
						<button
							type="button"
							onClick={() => void onLogout()}
							disabled={logoutBusy}
							className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-foreground bg-white px-4 text-center text-[14px] font-semibold text-foreground disabled:opacity-50"
						>
							{logoutBusy ? "Signing out…" : "Log out"}
						</button>
					) : null}
					{logoutError ? (
						<p className="text-center text-xs text-red-600" role="alert">
							{logoutError}
						</p>
					) : null}
				</div>
			</section>

			<section className="mt-4 overflow-hidden rounded-[20px] border border-gray-1 bg-white shadow-sm">
				<MenuLinkRow
					href="/profile/track-order"
					label="Track order"
					icon={<DocumentText size={iconSize} color={iconMuted} variant="Linear" />}
				/>
				<MenuLinkRow
					href="/chats"
					label="Messenger"
					icon={<MessageText1 size={iconSize} color={iconMuted} variant="Linear" />}
				/>
				<MenuLinkRow
					href="/favorites"
					label="My Favorites"
					icon={<Heart size={iconSize} color={iconMuted} variant="Linear" />}
				/>

				<AccordionSection
					title="Quick Links"
					icon={<Global size={iconSize} color={iconMuted} variant="Linear" />}
					open={quickOpen}
					onToggle={() => setQuickOpen(v => !v)}
				>
					<div className="flex flex-col py-1">
						<SubLink href="/about" label="About Us" />
						<SubLink href="/contact" label="Contact Us" />
						<SubLink href="https://stickerpadi.com" label="Stickerpadi" external />
						<SubLink href="https://padilifestyle.com" label="Padi Lifestyle" external />
					</div>
				</AccordionSection>

				<MenuLinkRow
					href="/help"
					label="Help Center"
					icon={<MessageQuestion size={iconSize} color={iconMuted} variant="Linear" />}
				/>

				<AccordionSection
					title="Socials"
					icon={<Messages2 size={iconSize} color={iconMuted} variant="Linear" />}
					open={socialOpen}
					onToggle={() => setSocialOpen(v => !v)}
				>
					<div className="flex flex-col py-1">
						<SubLink
							href={whatsappHref}
							label="WhatsApp"
							external
							icon={<WhatsAppGlyph />}
						/>
						<SubLink href="https://x.com" label="Twitter" external icon={<XGlyph />} />
						<SubLink
							href="https://instagram.com"
							label="Instagram"
							external
							icon={<InstagramGlyph />}
						/>
						<SubLink
							href="https://linkedin.com"
							label="LinkedIn"
							external
							icon={<LinkedInGlyph />}
						/>
					</div>
				</AccordionSection>
			</section>
		</div>
	);
}
