import { footerLinks, socials } from "@/lib/navigation";
import Link from "next/link";
import React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "./button";
import Image from "next/image";
import printpadi from "@/public/footer.svg";
const Footer = () => {
	return (
		<div className="bg-foreground mt-50 text-background font-bricolage-grotesque pt-12.5 pb-7.5 rounded-t-[40px] px-4">
			<InputGroup className="max-w-68 h-10.5 py-1.5 px-1 bg-gray-2 text-gray-3 border-none rounded-[36.82px]">
				<InputGroupInput
					placeholder="Enter Email"
					className="text-gray-3 text-[10px] "
				/>
				<InputGroupAddon align="inline-end" className="rounded-full mr-1.25">
					<Button className="bg-background text-foreground p-2.25 text-[9px]">
						subscribe
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<div className="mt-15.25">
				<h4 className="font-semibold text-base capitalize">quick links</h4>
				<ul className="grid grid-cols-2 gap-y-2 mt-5">
					{footerLinks.map(link => (
						<li key={link.name}>
							<Link href={link.link}>
								<span className="capitalize text-xs font-sans font-normal">
									{link.name}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className="my-15.25">
				<h4 className="font-semibold text-base capitalize">socials</h4>
				<ul className="flex items-center space-x-3.25 mt-5">
					{socials.map(link => (
						<li key={link.name}>
							<Link href={link.link}>
								<div className="h-7.5 w-7.5 bg-white flex justify-center rounded-full">
									<Image
										alt={link.name}
										src={`/icons/${link.name}.svg`}
										width={10}
										height={10}
									/>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<Image src={printpadi} alt="" />
		</div>
	);
};

export default Footer;
