import CtaSection from "@/components/footer/Ctasection";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import FeaturesSection from "@/components/home/Featuresection";
import HeroSection from "@/components/home/Herosection";
import HowItWorksSection from "@/components/home/Howitworkssection";
import ProblemSection from "@/components/home/Problemsection";
import SolutionSection from "@/components/home/Solutionsection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}