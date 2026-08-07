import {
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Route,
  Target,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import LoginForm
  from "../components/LoginForm";

const journeyPoints = [
  {
    icon: Target,
    title: "Continue with today's focus",
    description:
      "Return to your active mission and know exactly what needs your attention next.",
  },
  {
    icon: Route,
    title: "Stay aligned with your roadmap",
    description:
      "Keep progressing through the structured path built around your target role.",
  },
  {
    icon: BarChart3,
    title: "Build on your progress",
    description:
      "Your assessments, weekly reports, and previous performance continue shaping what comes next.",
  },
];

const LoginPage = () => {

  return (
    <main
      className="
                min-h-screen
                bg-slate-50
                lg:grid
                lg:grid-cols-2
            "
    >

      {/* Left Side */}

      <section
        className="
                    relative
                    hidden
                    overflow-hidden
                    bg-slate-950
                    px-12
                    py-12
                    text-white
                    lg:flex
                    lg:min-h-screen
                    lg:flex-col
                    xl:px-16
                "
      >

        {/* Background Details */}

        <div
          className="
                        absolute
                        -left-40
                        top-1/3
                        h-96
                        w-96
                        rounded-full
                        bg-indigo-600/10
                        blur-3xl
                    "
        />

        <div
          className="
                        absolute
                        -right-40
                        bottom-10
                        h-96
                        w-96
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                    "
        />


        {/* Brand */}

        <Link
          to="/"
          className="
                        relative
                        z-10
                        inline-flex
                        w-fit
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
                        "
          >
            CareerSaathi
          </span>

        </Link>


        {/* Main Content */}

        <div
          className="
                        relative
                        z-10
                        my-auto
                        max-w-xl
                        py-16
                    "
        >

          <p
            className="
                            text-sm
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-indigo-400
                        "
          >
            Welcome Back
          </p>

          <h1
            className="
                            mt-5
                            text-4xl
                            font-bold
                            leading-tight
                            tracking-tight
                            xl:text-5xl
                        "
          >
            Your career journey

            <span className="text-indigo-400">
              {" "}continues from where you left it.
            </span>
          </h1>

          <p
            className="
                            mt-6
                            max-w-lg
                            text-lg
                            leading-8
                            text-slate-400
                        "
          >
            Return to your CareerSaathi workspace,
            continue your current mission, and keep
            moving toward your career goal with a
            clear direction.
          </p>


          {/* Journey Points */}

          <div
            className="
                            mt-10
                            space-y-6
                        "
          >

            {journeyPoints.map(
              (point) => {

                const Icon =
                  point.icon;

                return (
                  <div
                    key={point.title}
                    className="
                                            flex
                                            gap-4
                                        "
                  >

                    <div
                      className="
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-slate-700
                                                bg-slate-900
                                            "
                    >
                      <Icon
                        size={20}
                        className="
                                                    text-indigo-400
                                                "
                      />
                    </div>

                    <div>
                      <h2
                        className="
                                                    font-semibold
                                                    text-white
                                                "
                      >
                        {point.title}
                      </h2>

                      <p
                        className="
                                                    mt-1
                                                    text-sm
                                                    leading-6
                                                    text-slate-400
                                                "
                      >
                        {point.description}
                      </p>
                    </div>

                  </div>
                );

              }
            )}

          </div>

        </div>


        {/* Bottom */}

        <div
          className="
                        relative
                        z-10
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-500
                    "
        >
          <CheckCircle2
            size={16}
            className="text-emerald-500"
          />

          Every completed mission moves you closer
          to your target role.
        </div>

      </section>


      {/* Right Side */}

      <section
        className="
                    flex
                    min-h-screen
                    flex-col
                    bg-white
                "
      >

        {/* Mobile Header */}

        <div
          className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-6
                        py-5
                        lg:hidden
                    "
        >

          <Link
            to="/"
            className="
                            flex
                            items-center
                            gap-2
                        "
          >

            <div
              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-600
                                text-white
                            "
            >
              <GraduationCap
                size={20}
              />
            </div>

            <span
              className="
                                font-bold
                                text-slate-900
                            "
            >
              CareerSaathi
            </span>

          </Link>

        </div>


        {/* Login Form */}

        <div
          className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        px-6
                        py-12
                        sm:px-10
                    "
        >
          <LoginForm />
        </div>

      </section>

    </main>
  );

};

export default LoginPage;