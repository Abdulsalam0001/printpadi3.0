"use client";

import { useEffect } from "react";
import { useFavoritesStore } from "@/features/favorites/favorites-store";

export default function FavoritesBootstrap() {
	const init = useFavoritesStore(s => s.init);

	useEffect(() => {
		void init();
	}, [init]);

	return null;
}
