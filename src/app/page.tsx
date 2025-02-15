import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import PhasesSection from "./components/PhasesSection";

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <About />
      <PhasesSection />
    </div>
  );
}
