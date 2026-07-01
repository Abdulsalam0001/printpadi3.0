
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/** Restores window scroll after navigation. */
export function ScrollRestoration() {
	const location = useLocation();

	useEffect(() => {
		// Always scroll to top on navigation
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return null;
}
