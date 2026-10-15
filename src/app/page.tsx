import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Expertise } from "@/components/Expertise";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { ProfessionalApproach } from "@/components/ProfessionalApproach";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Expertise />
        <Services />
        <Pricing />
        <ProfessionalApproach />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
