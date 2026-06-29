"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "iconsax-reactjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fieldInputClassName } from "@/features/curate-event/components/curate-event-field";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type CurateEventDateFieldProps = {
	value: string;
	onChange: (value: string) => void;
};

function parseStoredDate(value: string): Date | null {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		const [year, month, day] = trimmed.split("-").map(Number);
		const date = new Date(year, month - 1, day);
		return Number.isNaN(date.getTime()) ? null : date;
	}

	const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (slashMatch) {
		const [, day, month, year] = slashMatch;
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}

	return null;
}

function toStoredDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
	const date = parseStoredDate(value);
	if (!date) {
		return "";
	}

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function CurateEventDateField({ value, onChange }: CurateEventDateFieldProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const selectedDate = parseStoredDate(value);
	const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date());

	useEffect(() => {
		if (selectedDate) {
			setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
		}
	}, [value]);

	useEffect(() => {
		if (!open) {
			return;
		}

		function handlePointerDown(event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, [open]);

	const calendarDays = useMemo(() => {
		const year = viewMonth.getFullYear();
		const month = viewMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const leadingEmpty = firstDay.getDay();
		const days: Array<Date | null> = [];

		for (let i = 0; i < leadingEmpty; i += 1) {
			days.push(null);
		}

		for (let day = 1; day <= lastDay.getDate(); day += 1) {
			days.push(new Date(year, month, day));
		}

		return days;
	}, [viewMonth]);

	const monthLabel = viewMonth.toLocaleDateString("en-GB", {
		month: "long",
		year: "numeric",
	});

	const displayValue = formatDisplayDate(value);

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen(current => !current)}
				className={cn(
					fieldInputClassName,
					"flex items-center justify-between text-left",
					!displayValue && "text-neutral-400",
				)}
				aria-haspopup="dialog"
				aria-expanded={open}
			>
				<span className={displayValue ? "text-foreground" : undefined}>
					{displayValue || "dd/mm/yyyy"}
				</span>
				<CalendarIcon size={18} color="#000" variant="Linear" aria-hidden />
			</button>

			{open ? (
				<div
					role="dialog"
					aria-label="Choose event date"
					className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-[16px] border border-neutral-200 bg-white p-3 shadow-lg"
				>
					<div className="mb-3 flex items-center justify-between">
						<button
							type="button"
							onClick={() =>
								setViewMonth(
									current =>
										new Date(current.getFullYear(), current.getMonth() - 1, 1),
								)
							}
							className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-neutral-100"
							aria-label="Previous month"
						>
							<ChevronLeft className="size-4" />
						</button>
						<span className="text-sm font-semibold text-foreground">{monthLabel}</span>
						<button
							type="button"
							onClick={() =>
								setViewMonth(
									current =>
										new Date(current.getFullYear(), current.getMonth() + 1, 1),
								)
							}
							className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-neutral-100"
							aria-label="Next month"
						>
							<ChevronRight className="size-4" />
						</button>
					</div>

					<div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-neutral-400">
						{WEEKDAY_LABELS.map(label => (
							<span key={label} className="py-1">
								{label}
							</span>
						))}
					</div>

					<div className="mt-1 grid grid-cols-7 gap-1">
						{calendarDays.map((day, index) => {
							if (!day) {
								return <span key={`empty-${index}`} />;
							}

							const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
							const isToday = isSameDay(day, new Date());

							return (
								<button
									key={day.toISOString()}
									type="button"
									onClick={() => {
										onChange(toStoredDate(day));
										setOpen(false);
									}}
									className={cn(
										"flex size-9 items-center justify-center rounded-full text-sm transition-colors",
										isSelected
											? "bg-black text-white"
											: "text-foreground hover:bg-neutral-100",
										isToday && !isSelected && "border border-neutral-300",
									)}
								>
									{day.getDate()}
								</button>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
