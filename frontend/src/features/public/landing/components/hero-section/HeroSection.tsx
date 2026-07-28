import HeroContent
  from "./HeroContent";

import HeroPreview
  from "./HeroPreview";

const HeroSection = () => {

  return (

    <section
      className="
                relative
                overflow-hidden
                border-b
                border-slate-100
                bg-white
                pb-24
                pt-32
                lg:pb-32
                lg:pt-40
            "
    >

      {/* Background */}

      <div
        className="
                    pointer-events-none
                    absolute
                    inset-0
                    -z-10
                "
      >

        <div
          className="
                        absolute
                        -left-40
                        top-20
                        h-96
                        w-96
                        rounded-full
                        bg-indigo-100/60
                        blur-3xl
                    "
        />

        <div
          className="
                        absolute
                        right-0
                        top-0
                        h-96
                        w-96
                        rounded-full
                        bg-blue-100/50
                        blur-3xl
                    "
        />

      </div>

      <div
        className="
                    mx-auto
                    grid
                    max-w-[1440px]
                    grid-cols-1
                    items-center
                    gap-16
                    px-6
                    lg:grid-cols-[0.9fr_1.1fr]
                    lg:gap-10
                    xl:px-10
                "
      >

        <HeroContent />

        <HeroPreview />

      </div>

    </section>

  );

};

export default HeroSection;