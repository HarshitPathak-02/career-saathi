import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Route,
  Target,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import RegisterForm
  from "../components/RegistrationForm";

const journeyPoints = [

  {
    icon: Target,
    title: "Understand where you stand",
    description:
      "Start with your goals, current skills, and career direction.",
  },

  {
    icon: Route,
    title: "Get a structured career roadmap",
    description:
      "Turn your target role into clear skills, milestones, and weekly missions.",
  },

  {
    icon: BarChart3,
    title: "Improve every week",
    description:
      "Assess your progress, reflect on challenges, and let your next mission adapt.",
  },

];

const RegisterPage = () => {

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

        {/* Background Detail */}

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

            Your Career. Structured.

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

            Stop figuring out your career

            <span className="text-indigo-400">
              {" "}one random step at a time.
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

            CareerSaathi turns your career goal into
            a structured journey and helps you know
            what to focus on today, this week, and
            as you progress.

          </p>


          {/* Journey */}

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
                    key={
                      point.title
                    }
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
            className="
                            text-emerald-500
                        "
          />

          Your progress begins with understanding
          where you are today.

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


        {/* Desktop Back */}

        <div
          className="
                        hidden
                        px-10
                        pt-10
                        lg:block
                    "
        >

          <Link
            to="/"
            className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-500
                            transition
                            hover:text-slate-900
                        "
          >

            <ArrowLeft
              size={17}
            />

            Back to home

          </Link>

        </div>


        {/* Form */}

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

          <RegisterForm />

        </div>

      </section>

    </main>

  );

};

export default RegisterPage;