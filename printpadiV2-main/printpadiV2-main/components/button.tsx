"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Button = ({
	children,
	className,
	onClick,
	type = "button",
	disabled = false,
}: {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
}) => {
	return (
		<UIButton
			type={type}
			size="default"
			variant="default"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"text-[15px] capitalize font-medium px-3 py-1.5 rounded-[17.05px] cursor-pointer bg-foreground text-background hover:bg-foreground/90",
				className,
			)}
		>
			{children}
		</UIButton>
	);
};

export const BackButton = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	const router = useRouter();

	return (
		<UIButton
			type="button"
			size="default"
			variant="default"
			onClick={() => router.back()}
			className={cn(
				"text-[15px] capitalize font-medium px-3 py-1.5 rounded-[17.05px] cursor-pointer bg-foreground text-background hover:bg-foreground/90",
				className,
			)}
		>
			{children}
		</UIButton>
	);
};
