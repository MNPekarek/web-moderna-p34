import Link from "next/link";
import { ContactPanel } from "@/components/contact-panel";

export function HomeClosing() {
  return (
    <>
      <section id="contacto" className="home-closing" aria-labelledby="closing-title">
        <p className="eyebrow">05 — Contacto</p>
        <div className="home-closing__composition">
          <h2 id="closing-title">El próximo lugar<br /><em>todavía no existe.</em></h2>
          <div className="home-closing__meta" aria-label="Información del estudio">
            <div><span>Nuevos proyectos</span><p>Arquitectura · Desarrollo · Colaboraciones</p></div>
            <div><span>Estudio</span><p>Buenos Aires / Argentina</p></div>
          </div>
        </div>
        <ContactPanel />
      </section>

      <footer className="site-footer site-footer--editorial">
        <div className="site-footer__top">
          <div className="site-footer__identity"><Link className="brand" href="#umbral">P—34</Link><span className="site-footer__heading">Estudio</span><p>Paralelo 34<br />Arquitectura y desarrollo</p></div>
          <div className="site-footer__location"><span className="site-footer__heading">Sede</span><p>Buenos Aires<br />Argentina</p></div>
          <nav aria-label="Navegación del pie"><span className="site-footer__heading">Índice</span><Link href="#obras">Obras</Link><Link href="#territorio">Territorio</Link><Link href="#atlas">Atlas vivo</Link><Link href="#desarrollo">Desarrollo</Link></nav>
          <div className="site-footer__social" aria-label="Contacto y redes"><span className="site-footer__heading">Contacto</span><span>Email ↗</span><span>Instagram ↗</span><span>LinkedIn ↗</span></div>
        </div>
        <div className="site-footer__signature" aria-hidden="true">P—34</div>
        <div className="site-footer__bottom"><span>© 2026 P—34</span><span>34° Sur</span><span>A concept experience by Vykora.</span></div>
      </footer>

    </>
  );
}
