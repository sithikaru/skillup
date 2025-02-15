import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import PhasesSection from "./components/PhasesSection";
import SpeakersSection from "./components/Speakers";

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <About />
      <PhasesSection />
      <SpeakersSection/>
    </div>
  );
}
