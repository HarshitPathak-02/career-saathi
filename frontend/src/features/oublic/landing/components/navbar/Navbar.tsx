import { useEffect, useState } from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarActions from "./NavbarActions";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <NavbarLogo />

        {/* Desktop */}
        <div className="hidden md:block">
          <NavbarActions />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;