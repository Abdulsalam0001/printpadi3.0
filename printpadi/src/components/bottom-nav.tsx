
import { bottomNavLinks } from "@/lib/navigation";
import {
  Designtools,
  Home,
  SearchNormal,
  ShoppingCart,
  Profile,
} from "iconsax-reactjs";
import { useLocation, Link } from "react-router-dom";

const BottomNav = () => {
	const { pathname } = useLocation();
  if (pathname.startsWith("/service/")) {
    return null;
  }

  const getIcon = (linkName: string, isActive: boolean) => {
    const iconColor = isActive ? "#000" : "#AAAAAA";
    const iconProps = { size: "24", color: iconColor };

    switch (linkName) {
      case "home":
        return <Home {...iconProps} variant={isActive ? "Bold" : "Outline"} />;
      case "explore":
        return (
          <SearchNormal
            {...iconProps}
            variant={isActive ? "Bold" : "Outline"}
          />
        );
      case "my cart":
        return (
          <ShoppingCart
            {...iconProps}
            variant={isActive ? "Bold" : "Outline"}
          />
        );
      case "design":
        return (
          <Designtools {...iconProps} variant={isActive ? "Bold" : "Outline"} />
        );
      case "profile":
        return (
          <Profile {...iconProps} variant={isActive ? "Bold" : "Outline"} />
        );
      default:
        return <Home {...iconProps} variant={isActive ? "Bold" : "Outline"} />;
    }
  };

  return (
    <div className="px-5.75 py-3.75">
      <ul className="flex items-center justify-between">
        {bottomNavLinks.map((link, index) => {
          const isActive =
            link.link === "/"
              ? pathname === "/"
              : pathname.startsWith(link.link + "/") || pathname === link.link;
          return (
            <li key={index}>
              <Link
                to={link.link}
                className="flex flex-col items-center justify-center"
              >
                {getIcon(link.name, isActive)}
                <p
                  className={`capitalize text-xs font-light ${isActive ? "text-black" : "text-[#AAAAAA]"}`}
                >
                  {link.name}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomNav;
