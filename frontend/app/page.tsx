import Navbar from "@/components/Navbar";
import NavbarAnimInit from "@/components/NavbarAnimInit";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RolesMarquee from "@/components/landing/RolesMarquee";
import BentoGrid from "@/components/landing/BentoGrid";
import FaqAndSignup from "@/components/landing/FaqAndSignup";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <NavbarAnimInit />
      <main className="pt-24">
        <HeroSection />
        <FeaturesSection />
        <RolesMarquee />
        <BentoGrid />
        <FaqAndSignup />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
