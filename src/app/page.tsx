import { Hero } from "@/components/hero";
import { AtlasVivo } from "@/components/atlas-vivo";
import { Navigation } from "@/components/navigation";
import { Territory } from "@/components/territory";
import { SelectedWorks } from "@/components/selected-works";
import { Development } from "@/components/development";
import { HomeClosing } from "@/components/home-closing";
import { PhaseOneMotion } from "@/components/phase-one-motion";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#territorio">Ir al contenido</a>
      <PhaseOneMotion />
      <Navigation />
      <main>
        <Hero />
        <SelectedWorks />
        <Territory />
        <AtlasVivo />
        <Development />
        <HomeClosing />
      </main>
    </>
  );
}
