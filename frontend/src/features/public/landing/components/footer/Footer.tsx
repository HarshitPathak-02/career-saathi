import {
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const Footer = () => {

  const currentYear =
    new Date().getFullYear();

  return (

    <footer
      className="
                border-t
                border-slate-200
                bg-slate-950
                text-white
            "
    >

      <div
        className="
                    mx-auto
                    max-w-7xl
                    px-6
                    pb-8
                    pt-16
                    lg:pt-20
                "
      >

        {/* Main Footer */}

        <div
          className="
                        grid
                        gap-12
                        md:grid-cols-2
                        lg:grid-cols-12
                        lg:gap-8
                    "
        >

          {/* Brand */}

          <div
            className="
                            lg:col-span-5
                            lg:pr-16
                        "
          >

            <Link
              to="/"
              className="
                                inline-flex
                                items-center
                                gap-3
                            "
            >

              <div
                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-indigo-600
                                "
              >

                <GraduationCap
                  size={23}
                />

              </div>

              <span
                className="
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                "
              >

                CareerSaathi

              </span>

            </Link>


            <p
              className="
                                mt-6
                                max-w-md
                                text-base
                                leading-7
                                text-slate-400
                            "
            >

              A personalized career companion that
              turns your career goal into a structured
              journey — with adaptive roadmaps, weekly
              missions, assessments, reflections, and
              progress-driven guidance.

            </p>


            <Link
              to="/register"
              className="
                                group
                                mt-7
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-indigo-400
                                transition
                                hover:text-indigo-300
                            "
            >

              Start your career journey

              <ArrowUpRight
                size={16}
                className="
                                    transition-transform
                                    group-hover:-translate-y-0.5
                                    group-hover:translate-x-0.5
                                "
              />

            </Link>

          </div>


          {/* Explore */}

          <div
            className="
                            lg:col-span-2
                        "
          >

            <h3
              className="
                                text-sm
                                font-semibold
                                text-white
                            "
            >

              Explore

            </h3>

            <div
              className="
                                mt-5
                                flex
                                flex-col
                                gap-3
                            "
            >

              <a
                href="#how-it-works"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                How It Works

              </a>

              <a
                href="#features"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Why CareerSaathi

              </a>

              <a
                href="#weekly-insights"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Weekly Insights

              </a>

            </div>

          </div>


          {/* Account */}

          <div
            className="
                            lg:col-span-2
                        "
          >

            <h3
              className="
                                text-sm
                                font-semibold
                                text-white
                            "
            >

              Account

            </h3>

            <div
              className="
                                mt-5
                                flex
                                flex-col
                                gap-3
                            "
            >

              <Link
                to="/login"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Sign In

              </Link>

              <Link
                to="/register"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Create Account

              </Link>

            </div>

          </div>


          {/* Legal */}

          <div
            className="
                            lg:col-span-3
                        "
          >

            <h3
              className="
                                text-sm
                                font-semibold
                                text-white
                            "
            >

              Company

            </h3>

            <div
              className="
                                mt-5
                                flex
                                flex-col
                                gap-3
                            "
            >

              <Link
                to="/privacy"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Privacy Policy

              </Link>

              <Link
                to="/terms"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Terms of Service

              </Link>

              <Link
                to="/contact"
                className="
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:text-white
                                "
              >

                Contact

              </Link>

            </div>

          </div>

        </div>


        {/* Bottom */}

        <div
          className="
                        mt-16
                        flex
                        flex-col
                        gap-4
                        border-t
                        border-slate-800
                        pt-8
                        text-sm
                        text-slate-500
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
        >

          <p>

            © {currentYear} CareerSaathi.
            All rights reserved.

          </p>

          <p>

            Built to make career progress
            structured, measurable, and personal.

          </p>

        </div>

      </div>

    </footer>

  );

};

export default Footer;