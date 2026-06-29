import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import BottomNav from "@/components/bottom-nav";
import Providers from "@/app/providers";
import { Toaster } from "sonner";
import Navigation from "@/components/navigation";
import FavoritesBootstrap from "@/features/favorites/favorites-bootstrap";

const bricolageGrotesque = Bricolage_Grotesque({
	variable: "--font-bricolage-grotesque",
	subsets: ["latin"],
});
const publicSans = Public_Sans({
	variable: "--font-public-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PrintPadi",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${bricolageGrotesque.variable} ${publicSans.variable} antialiased relative`}
			>
				<Providers>
					<FavoritesBootstrap />
					<Suspense fallback={null}>
						<Navigation />
					</Suspense>
					{children}
					<Toaster richColors position="top-center" />
					{/* <Footer /> */}
					<div className="fixed bottom-0 bg-white w-full z-50">
						<BottomNav />
					</div>
				</Providers>
			</body>
		</html>
	);
}
