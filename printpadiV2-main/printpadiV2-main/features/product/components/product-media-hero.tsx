"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type MediaMode = "photo" | "video";

export function ProductMediaHero({ images, name }: { images: string[]; name: string }) {
	const gallery = images.length > 0 ? images : ["/shirts.svg"];
	const [mode, setMode] = useState<MediaMode>("photo");
	const [api, setApi] = useState<CarouselApi>();
	const [activeIndex, setActiveIndex] = useState(0);

	const onSelect = useCallback((carouselApi: CarouselApi) => {
		if (!carouselApi) {
			return;
		}
		setActiveIndex(carouselApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!api) {
			return;
		}

		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);

		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api, onSelect]);

	useEffect(() => {
		if (!api) {
			return;
		}
		api.reInit();
		api.scrollTo(0, true);
		setActiveIndex(0);
	}, [api, images]);

	const goToSlide = (index: number) => {
		api?.scrollTo(index);
		setActiveIndex(index);
	};

	return (
		<div className="px-4 pt-4">
			<div className="rounded-[15px] border border-gray-1 bg-white px-4 pb-4 pt-4 shadow-sm">
				<div className="mx-auto mb-4 flex w-fit rounded-full bg-[#F3F4F6] p-0.5">
					<button
						type="button"
						onClick={() => setMode("photo")}
						className={cn(
							"rounded-full px-4 py-1 text-[11px] font-medium transition-colors",
							mode === "photo" ? "bg-black text-white" : "text-gray-4",
						)}
					>
						Photo
					</button>
					<button
						type="button"
						onClick={() => setMode("video")}
						disabled
						className={cn(
							"rounded-full px-4 py-1 text-[11px] font-medium text-gray-3",
							mode === "video" && "bg-black text-white",
						)}
						title="Video coming soon"
					>
						Video
					</button>
				</div>

				<Carousel
					setApi={setApi}
					className="mx-auto w-full max-w-[220px]"
					opts={{
						align: "center",
						loop: gallery.length > 1,
						dragFree: false,
					}}
				>
					<CarouselContent className="ml-0">
						{gallery.map((src, index) => (
							<CarouselItem key={`${src}-${index}`} className="basis-full pl-0">
								<div className="relative mx-auto flex h-[200px] w-full items-center justify-center">
									<Image
										src={src}
										alt={gallery.length > 1 ? `${name} — image ${index + 1}` : name}
										fill
										className="object-contain object-center"
										sizes="220px"
										priority={index === 0}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				{gallery.length > 1 ? (
					<div className="mt-4 flex items-center justify-center gap-1.5">
						{gallery.map((_, index) => (
							<button
								key={index}
								type="button"
								onClick={() => goToSlide(index)}
								className={cn(
									"h-1.5 rounded-full transition-all",
									index === activeIndex ? "w-4 bg-[#374151]" : "w-1.5 bg-[#D1D5DB]",
								)}
								aria-label={`Show image ${index + 1}`}
								aria-current={index === activeIndex ? "true" : undefined}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
