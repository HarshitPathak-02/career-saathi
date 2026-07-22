import Navbar from "../components/navbar";
import HeroSection from "../components/hero-section/index";
import HowItWorksSection from "../components/how-it-works/index";
import WhyCareerSaathiSection from "../components/why-career-saathi/index";
import CTASection from "../components/cta/index";
import Footer from "../components/footer/index";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhyCareerSaathiSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;