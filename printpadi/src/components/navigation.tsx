
import React from "react";
import { useLocation } from "react-router-dom";

const Navigation = () => {
	// Simple navigation stub - can be expanded later
	const location = useLocation();
	
	if (location.pathname === "/" || location.pathname === "/home") {
		return null;
	}

	return (
		<div className="font-bricolage-grotesque">
			{/* Navigation content */}
		</div>
	);
};

export default Navigation;
