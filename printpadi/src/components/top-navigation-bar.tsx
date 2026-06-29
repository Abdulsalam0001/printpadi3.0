

import { IonImg } from "@ionic/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SearchNormal } from "iconsax-reactjs";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export type TopNavigationBarProps = {
	showBack?: boolean;
	restoreScrollOnBack?: boolean;
	searchDefaultValue?: string;
	searchHiddenFields?: Record<string, string>;
};

export function TopNavigationBar({
	showBack = false,
	restoreScrollOnBack = false,
	searchDefaultValue,
	searchHiddenFields,
}: TopNavigationBarProps) {
	const handleBack = () => {
		window.history.back();
	};

	return (
		<div className="bg-black p-5 flex items-center gap-2.5">
			{showBack ? (
				<button
					type="button"
					onClick={handleBack}
					className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
					aria-label="Go back"
				>
					<ArrowLeft className="size-4" strokeWidth={2.25} />
				</button>
			) : null}
			<Link to="/" className="shrink-0">
				<img
					src="/printpadi.svg"
					alt="Printpadi logo"
					style={{ width: '100px', height: '25px' }}
					loading="lazy"
				/>
			</Link>
			<div className="flex min-w-0 flex-1 items-center justify-end space-x-2.5">
				<form
					action="/search"
					method="get"
					className="max-w-38.5 min-w-0 shrink pr-1"
				>
					{searchHiddenFields
						? Object.entries(searchHiddenFields).map(([name, value]) => (
								<input key={name} type="hidden" name={name} value={value} />
							))
						: null}
					<InputGroup className="max-w-38.5 py-1.25 pr-2.5 bg-gray-2 text-gray-3 border-none rounded-[20px]">
						<InputGroupInput
							name="q"
							defaultValue={searchDefaultValue}
							placeholder="Search"
							className="text-gray-3 text-[10px]"
							aria-label="Search products"
						/>
						<InputGroupAddon
							align="inline-end"
							className="bg-black p-0.75 rounded-full mr-2"
						>
							<button
								type="submit"
								className="flex items-center justify-center"
								aria-label="Submit search"
							>
								<SearchNormal size="12" color="#AAAAAA" />
							</button>
						</InputGroupAddon>
					</InputGroup>
				</form>
				<div className="shrink-0">
					<img src="/nigerian-flag.svg" alt="menu" style={{ width: '25px', height: '25px' }} />
				</div>
			</div>
		</div>
	);
}
