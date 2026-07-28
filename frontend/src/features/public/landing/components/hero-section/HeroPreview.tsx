import workspace1Image
  from "../../assets/workspace1.png";

import workspace2Image
  from "../../assets/workspace2.png";

import roamapImage
  from "../../assets/roadmap.png";

import assessmentImage
  from "../../assets/assessment.png";

const HeroPreview = () => {

  return (

    <div
      className="
                relative
                mx-auto
                h-125
                w-full
                max-w-162.5
                lg:h-135
                lg:max-w-170
            "
    >

      {/* Background Glow */}

      <div
        className="
                    absolute
                    left-1/2
                    top-1/2
                    h-105
                    w-130
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-200/40
                    blur-3xl
                "
      />

      {/* Weekly Report */}

      <div
        className="
                    absolute
                    left-[5%]
                    top-[2%]
                    z-10
                    w-[58%]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
      >

        <img
          src={workspace1Image}
          alt="CareerSaathi career journey information"
          className="w-full"
        />

      </div>

      {/* Workspace */}

      <div
        className="
                    absolute
                    left-[50%]
                    top-[17%]
                    z-20
                    w-[56%]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
      >

        <img
          src={workspace2Image}
          alt="CareerSaathi personalized workspace"
          className="w-full"
        />

      </div>

      {/* Mission Details */}

      <div
        className="
                    absolute
                    bottom-[15%]
                    left-[0%]
                    z-30
                    w-[54%]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
      >

        <img
          src={assessmentImage}
          alt="CareerSaathi assessment details"
          className="w-full"
        />

      </div>

      {/* Weekly Review */}

      <div
        className="
                    absolute
                    bottom-[0%]
                    right-[2%]
                    z-40
                    w-[59%]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
      >

        <img
          src={roamapImage}
          alt="CareerSaathi roadmap"
          className="w-full"
        />

      </div>

    </div>

  );

};

export default HeroPreview;