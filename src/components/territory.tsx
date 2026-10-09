import { Scene } from "@/components/scene";
import { TerritoryContinuation } from "@/components/territory-continuation";

export function Territory() {
  return (
    <Scene id="territorio" className="territory-scene">
      <div className="territory-sticky" data-territory-sticky>
        <div className="territory-grid">
          <div className="territory-copy">
            <p className="eyebrow">02 — Territorio</p>
            <blockquote>
              <span>Construimos</span>
              <span>desde el lugar,</span>
              <span><em>no sobre él.</em></span>
            </blockquote>
            <p className="territory-note">
              Lugar, orientación, materia y paisaje forman un único sistema de decisiones.
            </p>
          </div>
          <TerritoryContinuation />
        </div>
      </div>
    </Scene>
  );
}
