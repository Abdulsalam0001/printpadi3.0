"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { fetchAuthMeOptional } from "@/shared/api/auth";
import {
	deleteFavoriteProduct,
	fetchFavoriteProductIds,
	mergeFavoriteProducts,
	postFavoriteProduct,
} from "@/shared/api/favorites";

export const FAVORITE_PRODUCT_IDS_STORAGE_KEY = "printpadi:favorite-product-ids";

function readLocalFavoriteIds(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(FAVORITE_PRODUCT_IDS_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return [...new Set(parsed.filter((id): id is string => typeof id === "string"))];
	} catch {
		return [];
	}
}

function writeLocalFavoriteIds(ids: string[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(FAVORITE_PRODUCT_IDS_STORAGE_KEY, JSON.stringify(ids));
}

function clearLocalFavoriteIds(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(FAVORITE_PRODUCT_IDS_STORAGE_KEY);
}

type InitOptions = {
	force?: boolean;
};

type FavoritesState = {
	favoriteIds: string[];
	isAuthenticated: boolean;
	ready: boolean;
	init: (opts?: InitOptions) => Promise<void>;
	toggleFavorite: (productId: string) => Promise<void>;
	isFavorite: (productId: string) => boolean;
	rehydrateGuestAfterLogout: () => void;
};

let initInFlight: Promise<void> | null = null;

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
	favoriteIds: [],
	isAuthenticated: false,
	ready: false,

	isFavorite: productId => get().favoriteIds.includes(productId),

	init: async (opts?: InitOptions) => {
		const force = Boolean(opts?.force);
		if (!force && get().ready) return;
		if (initInFlight) {
			await initInFlight;
			if (!force && get().ready) return;
		}

		initInFlight = (async () => {
			try {
				if (force) {
					set({ ready: false });
				}
				const user = await fetchAuthMeOptional();
				if (!user) {
					set({
						favoriteIds: readLocalFavoriteIds(),
						isAuthenticated: false,
						ready: true,
					});
					return;
				}
				try {
					let ids = await fetchFavoriteProductIds();
					const localIds = readLocalFavoriteIds();
					if (localIds.length > 0) {
						ids = await mergeFavoriteProducts(localIds);
						clearLocalFavoriteIds();
					}
					set({
						favoriteIds: ids,
						isAuthenticated: true,
						ready: true,
					});
				} catch {
					set({
						favoriteIds: [],
						isAuthenticated: true,
						ready: true,
					});
				}
			} catch {
				set({
					favoriteIds: readLocalFavoriteIds(),
					isAuthenticated: false,
					ready: true,
				});
			} finally {
				initInFlight = null;
			}
		})();

		await initInFlight;
	},

	rehydrateGuestAfterLogout: () => {
		set({
			favoriteIds: readLocalFavoriteIds(),
			isAuthenticated: false,
			ready: true,
		});
	},

	toggleFavorite: async productId => {
		if (!get().ready) {
			await get().init();
		}

		const { favoriteIds, isAuthenticated } = get();
		const wasFavorite = favoriteIds.includes(productId);
		const optimistic = wasFavorite
			? favoriteIds.filter(id => id !== productId)
			: [...favoriteIds, productId];

		set({ favoriteIds: optimistic });

		try {
			if (isAuthenticated) {
				const ids = wasFavorite
					? await deleteFavoriteProduct(productId)
					: await postFavoriteProduct(productId);
				set({ favoriteIds: ids });
			} else {
				writeLocalFavoriteIds(optimistic);
			}
		} catch (err) {
			set({ favoriteIds });
			toast.error(err instanceof Error ? err.message : "Could not update favorite.");
		}
	},
}));
