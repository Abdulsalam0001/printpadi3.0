

import * as React from "react";
import {
	Carousel as CarouselS,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export const Carousel = ({
	images,
	children,
}: {
	images: string[];
	children?: React.ReactNode;
}) => {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<div className="relative mx-auto">
			<CarouselS
				setApi={setApi}
				className="w-full"
				plugins={[
					Autoplay({
						delay: 2000,
					}),
				]}
			>
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<div className="relative w-full h-28.75 overflow-hidden rounded-[20px]">
								<img
									src={image}
									alt="banner"
									className="w-full h-full object-cover object-center brightness-75"
								/>

								<div className="absolute inset-0 bg-black/20"></div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</CarouselS>
			<div className="flex items-center justify-center space-x-1.5 absolute left-1/2 -translate-x-1/2 bottom-2.25">
				{Array.from({ length: count }, (_, i) => (
					<div
						key={i}
						className={cn(
							"h-1.5 w-1.5 rounded-full bg-white",
							i > current - 1 && "opacity-50",
						)}
					></div>
				))}
			</div>
			<div className="absolute top-1/2 -translate-y-1/2 left-3.75">
				{children}
			</div>
		</div>
	);
};

export const ImageContainer = ({
	image,
	children,
	className,
	darken,
}: {
	image: string;
	children?: React.ReactNode;
	className?: string;
	darken?: boolean;
}) => {
	return (
		<div>
			<div
				className={cn(
					"relative w-full h-28.75 overflow-hidden rounded-[20px]",
					className,
				)}
			>
				<img
					src={image}
					alt="banner"
					className={cn(
						"w-full h-full object-cover object-center",
						darken && "brightness-75",
					)}
				/>

				<div
					className={cn(
						"absolute inset-0 bg-[#00000066]/40",
						!darken && "hidden",
					)}
				></div>
				<div className="absolute top-1/2 -translate-y-1/2 left-3.75">
					{children}
				</div>
			</div>
		</div>
	);
};
