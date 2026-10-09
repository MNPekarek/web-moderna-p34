import Image from "next/image";
import Link from "next/link";
import { casaLitoral } from "@/content/projects/casa-litoral";
import { getProjectImage } from "@/content/selectors";

export function Hero() {
  const image = getProjectImage(casaLitoral, "casa-litoral-hero");
  return (
    <section id="umbral" className="home-hero" aria-labelledby="home-title">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" quality={92} className="home-hero__image" />
      <div className="home-hero__veil" aria-hidden="true" />
      <h1 id="home-title"><span>P—34</span><em>Arquitectura que<br />pertenece al lugar.</em></h1>
      <p className="home-hero__edition">PARALELO 34<br />Buenos Aires / Argentina</p>
      <Link className="home-hero__scroll" href="#obras">Descender <i /></Link>
    </section>
  );
}
