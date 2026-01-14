import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const onboardingSchema = z.object({
	name: z.string().min(2, {
		message: "Workspace name must be at least 2 characters.",
	}),
	slug: z.string().min(2, {
		message: "Slug must be at least 2 characters.",
	}),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
type OnboardingState = Partial<OnboardingSchema> & {
	setData: (data: Partial<OnboardingSchema>) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set) => ({
			setData: (data) => set(data),
		}),
		{
			name: "onboarding-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
