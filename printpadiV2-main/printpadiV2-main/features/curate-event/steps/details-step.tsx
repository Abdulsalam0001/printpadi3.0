"use client";

import { Calendar, Edit, Location, Note, People } from "iconsax-reactjs";
import {
	CurateEventField,
	fieldInputClassName,
	fieldTextareaClassName,
} from "@/features/curate-event/components/curate-event-field";
import { CurateEventDateField } from "@/features/curate-event/components/curate-event-date-field";
import type { CurateEventDetails } from "@/features/curate-event/curate-event-details";

type DetailsStepProps = {
	details: CurateEventDetails;
	onChange: (details: CurateEventDetails) => void;
};

export function DetailsStep({ details, onChange }: DetailsStepProps) {
	return (
		<section className="px-4 pt-5" data-testid="curate-event-details-step">
			<h2 className="text-center font-bricolage-grotesque text-[20px] font-bold leading-[1.2] text-[#1B2559]">
				Tell Us About Your Event
			</h2>
			<p className="mt-1.5 text-center text-[12px] leading-snug text-neutral-500">
				this help us recommend the right products in right quantities
			</p>

			<div className="mt-5 rounded-[20px] border border-neutral-200 bg-white p-5 shadow-sm">
				<div className="space-y-5">
					<CurateEventField
						label="Event Name"
						icon={<Edit size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="text"
							name="eventName"
							value={details.eventName}
							onChange={event =>
								onChange({ ...details, eventName: event.target.value })
							}
							placeholder="e.g., Sarah's 30th Birthday"
							autoComplete="off"
							className={fieldInputClassName}
						/>
					</CurateEventField>

					<CurateEventField
						label="Event Description"
						icon={<Note size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<textarea
							name="eventDescription"
							value={details.eventDescription}
							onChange={event =>
								onChange({ ...details, eventDescription: event.target.value })
							}
							placeholder="Tell us a bit more about your event"
							rows={3}
							className={fieldTextareaClassName}
						/>
					</CurateEventField>

					<CurateEventField
						label="Event Date"
						icon={<Calendar size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<CurateEventDateField
							value={details.eventDate}
							onChange={eventDate => onChange({ ...details, eventDate })}
						/>
					</CurateEventField>

					<CurateEventField
						label="Event Location"
						icon={<Location size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="text"
							name="eventLocation"
							value={details.eventLocation}
							onChange={event =>
								onChange({ ...details, eventLocation: event.target.value })
							}
							placeholder="e.g., Lagos, Nigeria"
							className={fieldInputClassName}
						/>
					</CurateEventField>

					<CurateEventField
						label="Estimated Guest Count"
						icon={<People size={16} color="#000" variant="Linear" aria-hidden />}
					>
						<input
							type="number"
							name="guestCount"
							min={1}
							inputMode="numeric"
							value={details.guestCount}
							onChange={event =>
								onChange({ ...details, guestCount: event.target.value })
							}
							placeholder="e.g., 100"
							className={fieldInputClassName}
						/>
					</CurateEventField>
				</div>
			</div>
		</section>
	);
}
