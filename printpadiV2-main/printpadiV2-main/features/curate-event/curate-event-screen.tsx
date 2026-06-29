"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
	createEmptyCurateEventDetails,
	isCurateEventDetailsComplete,
	type CurateEventDetails,
} from "@/features/curate-event/curate-event-details";
import { CurateEventHeader } from "@/features/curate-event/components/curate-event-header";
import { CurateEventProceedButton } from "@/features/curate-event/components/curate-event-proceed-button";
import { CurateEventStepper } from "@/features/curate-event/components/curate-event-stepper";
import { canAccessCurateEventStep } from "@/features/curate-event/curate-event-step-access";
import { CategoryStep } from "@/features/curate-event/steps/category-step";
import { DetailsStep } from "@/features/curate-event/steps/details-step";
import { RecommendationsStep } from "@/features/curate-event/steps/recommendations-step";
import { StyleStep } from "@/features/curate-event/steps/style-step";
import {
	CURATE_EVENT_STORAGE_KEY,
	type CurateEventPersistedState,
	type CurateEventStep,
} from "@/features/curate-event/types";
import type { EventStyleDto } from "@/lib/event-styles";
import type { EventTypeDto } from "@/lib/event-types";

type CurateEventScreenProps = {
	eventTypes: EventTypeDto[];
	eventStyles: EventStyleDto[];
};

function readPersistedState(): CurateEventPersistedState | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = sessionStorage.getItem(CURATE_EVENT_STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const parsed = JSON.parse(raw) as CurateEventPersistedState;
		if (typeof parsed !== "object" || parsed === null || typeof parsed.step !== "string") {
			return null;
		}

		if (
			parsed.selectedEventTypeId != null &&
			typeof parsed.selectedEventTypeId !== "string"
		) {
			return null;
		}

		if (
			parsed.selectedEventStyleId != null &&
			typeof parsed.selectedEventStyleId !== "string"
		) {
			return null;
		}

		return {
			selectedEventTypeId: parsed.selectedEventTypeId,
			selectedEventStyleId: parsed.selectedEventStyleId ?? null,
			step: parsed.step,
			details: {
				...createEmptyCurateEventDetails(),
				...(parsed.details ?? {}),
			},
		};
	} catch {
		return null;
	}
}

function writePersistedState(state: CurateEventPersistedState) {
	if (typeof window === "undefined") {
		return;
	}

	sessionStorage.setItem(CURATE_EVENT_STORAGE_KEY, JSON.stringify(state));
}

function createVisualRecommendationsDetails(): CurateEventDetails {
	return {
		eventName: "Sarah's 30th Birthday",
		eventDescription: "Outdoor celebration with close friends and family.",
		eventDate: "2026-07-15",
		eventLocation: "Lagos, Nigeria",
		guestCount: "50",
	};
}

export default function CurateEventScreen({
	eventTypes,
	eventStyles,
}: CurateEventScreenProps) {
	const [step, setStep] = useState<CurateEventStep>("category");
	const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(
		null,
	);
	const [selectedEventStyleId, setSelectedEventStyleId] = useState<string | null>(
		null,
	);
	const [details, setDetails] = useState<CurateEventDetails>(
		createEmptyCurateEventDetails(),
	);
	const [hydrated, setHydrated] = useState(false);

	useLayoutEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const visualStep = params.get("visualStep") as CurateEventStep | null;
		const persisted = readPersistedState();

		if (persisted) {
			setSelectedEventTypeId(persisted.selectedEventTypeId);
			setSelectedEventStyleId(persisted.selectedEventStyleId);
			setDetails({
				...createEmptyCurateEventDetails(),
				...persisted.details,
			});
		}

		if (
			visualStep === "details" ||
			visualStep === "style" ||
			visualStep === "recommendations"
		) {
			setStep(visualStep);
			if (!persisted?.selectedEventTypeId && eventTypes[0]) {
				setSelectedEventTypeId(eventTypes[0].id);
			}
			if (visualStep === "recommendations") {
				if (!persisted?.selectedEventStyleId && eventStyles[0]) {
					setSelectedEventStyleId(eventStyles[0].id);
				}
				if (!persisted || !isCurateEventDetailsComplete(persisted.details)) {
					setDetails(createVisualRecommendationsDetails());
				}
			}
		} else if (persisted) {
			setStep(persisted.step);
		}

		setHydrated(true);
	}, [eventTypes, eventStyles]);

	useEffect(() => {
		if (!hydrated) {
			return;
		}

		writePersistedState({
			step,
			selectedEventTypeId,
			selectedEventStyleId,
			details,
		});
	}, [hydrated, step, selectedEventTypeId, selectedEventStyleId, details]);

	const canProceed = useMemo(() => {
		if (step === "category") {
			return Boolean(selectedEventTypeId);
		}

		if (step === "details") {
			return isCurateEventDetailsComplete(details);
		}

		if (step === "style") {
			return Boolean(selectedEventStyleId);
		}

		return true;
	}, [details, selectedEventStyleId, selectedEventTypeId, step]);

	const onStepChange = useCallback(
		(nextStep: CurateEventStep) => {
			if (
				!canAccessCurateEventStep(nextStep, {
					selectedEventTypeId,
					selectedEventStyleId,
					details,
				})
			) {
				return;
			}

			setStep(nextStep);
		},
		[details, selectedEventStyleId, selectedEventTypeId],
	);

	const canAccessStep = useCallback(
		(targetStep: CurateEventStep) =>
			canAccessCurateEventStep(targetStep, {
				selectedEventTypeId,
				selectedEventStyleId,
				details,
			}),
		[details, selectedEventStyleId, selectedEventTypeId],
	);

	const onProceed = useCallback(() => {
		if (!canProceed) {
			return;
		}

		if (step === "category") {
			setStep("details");
			return;
		}

		if (step === "details") {
			setStep("style");
			return;
		}

		if (step === "style") {
			setStep("recommendations");
		}
	}, [canProceed, step]);

	const showProceed =
		step === "category" || step === "details" || step === "style";

	return (
		<div
			data-testid="curate-event-screen"
			className="relative mx-auto flex min-h-screen max-w-md flex-col bg-[#F8F8F8] pb-28 font-[family-name:var(--font-public-sans)]"
		>
			<CurateEventHeader />
			<CurateEventStepper
				currentStep={step}
				onStepChange={onStepChange}
				canAccessStep={canAccessStep}
			/>

			{step === "category" ? (
				<CategoryStep
					eventTypes={eventTypes}
					selectedEventTypeId={selectedEventTypeId}
					onSelect={setSelectedEventTypeId}
				/>
			) : null}

			{step === "details" ? (
				<DetailsStep details={details} onChange={setDetails} />
			) : null}

			{step === "style" ? (
				<StyleStep
					eventStyles={eventStyles}
					selectedEventStyleId={selectedEventStyleId}
					onSelect={setSelectedEventStyleId}
				/>
			) : null}

			{step === "recommendations" ? (
				<RecommendationsStep
					eventTypes={eventTypes}
					selectedEventTypeId={selectedEventTypeId}
					details={details}
				/>
			) : null}

			{showProceed ? (
				<CurateEventProceedButton
					disabled={!canProceed}
					onClick={onProceed}
				/>
			) : null}
		</div>
	);
}
