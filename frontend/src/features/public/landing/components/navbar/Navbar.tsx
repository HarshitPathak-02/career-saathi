import {
  useEffect,
  useState,
} from "react";

import NavbarLogo
  from "./NavbarLogo";

import NavbarActions
  from "./NavbarActions";

import MobileMenu
  from "./MobileMenu";

const Navbar = () => {

  const [
    isScrolled,
    setIsScrolled,
  ] = useState(false);

  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(
        window.scrollY > 16
      );

    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);

  return (

    <header
      className={`
                fixed
                left-0
                top-0
                z-50
                w-full
                transition-all
                duration-300

                ${isScrolled
          ? `
                        border-b
                        border-slate-200/80
                        bg-white/90
                        shadow-sm
                        backdrop-blur-xl
                    `
          : `
                        border-b
                        border-transparent
                        bg-white/70
                        backdrop-blur-md
                    `
        }
            `}
    >

      <div
        className="
                    mx-auto
                    flex
                    h-20
                    max-w-[1440px]
                    items-center
                    justify-between
                    px-6
                    xl:px-10
                "
      >

        {/* Brand */}

        <NavbarLogo />

        {/* Desktop */}

        <div className="hidden lg:block">

          <NavbarActions />

        </div>

        {/* Mobile / Tablet */}

        <div className="lg:hidden">

          <MobileMenu />

        </div>

      </div>

    </header>

  );

};

export default Navbar;