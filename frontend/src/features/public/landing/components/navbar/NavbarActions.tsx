import {
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const NavbarActions = () => {

  return (

    <div className="flex items-center gap-8">

      {/* Landing Navigation */}

      <div
        className="
                    flex
                    items-center
                    gap-7
                "
      >

        <a
          href="#product"
          className="
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:text-slate-950
                    "
        >
          Product
        </a>

        <a
          href="#how-it-works"
          className="
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:text-slate-950
                    "
        >
          How It Works
        </a>

        <a
          href="#weekly-insights"
          className="
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:text-slate-950
                    "
        >
          Weekly Insights
        </a>

      </div>

      {/* Separator */}

      <div
        className="
                    h-6
                    w-px
                    bg-slate-200
                "
      />

      {/* Authentication */}

      <div className="flex items-center gap-3">

        <Link
          to="/login"
          className="
                        rounded-lg
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        hover:text-slate-950
                    "
        >
          Log in
        </Link>

        <Link
          to="/register"
          className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-slate-950
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-slate-800
                    "
        >

          Start Your Journey

          <ArrowRight
            size={16}
          />

        </Link>

      </div>

    </div>

  );

};

export default NavbarActions;