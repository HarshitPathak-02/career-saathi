import {
  useState,
} from "react";

import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const MobileMenu = () => {

  const [
    open,
    setOpen,
  ] = useState(false);

  const closeMenu = () => {

    setOpen(false);

  };

  return (

    <>

      {/* Toggle */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            previous =>
              !previous
          )
        }
        aria-label={
          open
            ? "Close navigation"
            : "Open navigation"
        }
        aria-expanded={open}
        className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-700
                    transition
                    hover:bg-slate-100
                "
      >

        {open ? (

          <X
            size={22}
          />

        ) : (

          <Menu
            size={22}
          />

        )}

      </button>

      {/* Menu */}

      {open && (

        <div
          className="
                        absolute
                        left-0
                        top-full
                        w-full
                        border-t
                        border-slate-200
                        bg-white
                        shadow-xl
                        md:hidden
                    "
        >

          <div
            className="
                            mx-auto
                            max-w-7xl
                            px-6
                            py-6
                        "
          >

            {/* Navigation */}

            <nav
              className="
                                flex
                                flex-col
                            "
            >

              <a
                href="#product"
                onClick={closeMenu}
                className="
                                    border-b
                                    border-slate-100
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
              >
                Product
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="
                                    border-b
                                    border-slate-100
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
              >
                How It Works
              </a>

              <a
                href="#weekly-insights"
                onClick={closeMenu}
                className="
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
              >
                Weekly Insights
              </a>

            </nav>

            {/* Actions */}

            <div
              className="
                                mt-5
                                grid
                                gap-3
                            "
            >

              <Link
                to="/login"
                onClick={closeMenu}
                className="
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-slate-950
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                "
              >

                Start Your Journey

                <ArrowRight
                  size={17}
                />

              </Link>

            </div>

          </div>

        </div>

      )}

    </>

  );

};

export default MobileMenu;