"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	isSubpageTopNavRoute,
	padiGroups,
	padiOffers,
	padiServices,
} from "@/lib/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { TopNavigationBar } from "@/components/top-navigation-bar";

const Navigation = () => {
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const isHome = pathName === "/";
	const isSubpage = isSubpageTopNavRoute(pathName);

	if (!isHome && !isSubpage) {
		return null;
	}

	const searchDefaultValue =
		pathName.startsWith("/search") ? (searchParams.get("q")?.trim() ?? "") : undefined;
	const searchTag = searchParams.get("tag")?.trim();
	const searchHiddenFields =
		pathName.startsWith("/search") && searchTag ? { tag: searchTag } : undefined;
	const restoreScrollOnBack = pathName.startsWith("/product/");

	return (
		<div className="font-bricolage-grotesque">
			<TopNavigationBar
				showBack={isSubpage}
				restoreScrollOnBack={restoreScrollOnBack}
				searchDefaultValue={searchDefaultValue}
				searchHiddenFields={searchHiddenFields}
			/>
			{isHome ? (
				<>
					<div className="bg-white p-5 flex items-center justify-between">
						<ul className="flex items-center space-x-2.5">
							{padiGroups.map(link => (
								<li
									key={link.link}
									className={cn(
										"capitalize text-sm font-light active:-translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200",
										link.name == "products" && "font-semibold",
									)}
								>
									<Link href={link.link}>{link.name}</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="bg-gray-1 p-5 flex flex-col space-y-5">
						<ul className="flex items-center space-x-5 overflow-x-scroll">
							{padiOffers.map(link => (
								<li
									key={link.link}
									className={cn(
										"capitalize text-gray-4 text-xs font-normal active:-translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200",
										pathName == link.link && "text-active-link",
										pathName.includes(link.name) && "text-active-link",
									)}
								>
									<Link href={link.link}>{link.name}</Link>
								</li>
							))}
						</ul>
						<ul className="flex items-center space-x-1.5 overflow-x-scroll ">
							{padiServices.map(link => (
								<li
									key={link.link}
									className={cn(
										"capitalize text-[8px] font-medium active:-translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200 bg-white rounded-[5px] text-black py-0.75 px-1.25",
										(link.name === "Printpadi AI" || link.name === "Virtual Studio") &&
											"normal-case",
									)}
								>
									<Link
										href={link.link}
										className="flex items-center space-x-1.25 justify-center"
									>
										<img
											alt=""
											src={link.image}
											width={64}
											height={64}
										className={cn(
											"size-4 shrink-0 object-contain"
											
										)}
											aria-hidden
										/>
										<p>{link.name}</p>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</>
			) : null}
		</div>
	);
};

export default Navigation;
