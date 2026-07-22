import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
        <HeroContent />
        <HeroPreview />
      </div>
    </section>
  );
};

export default HeroSection;