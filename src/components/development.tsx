const stages = [
  ["Territorio", "Leer el lugar."],
  ["Proyecto", "Definir una respuesta."],
  ["Desarrollo", "Convertirla en sistema."],
  ["Obra", "Materializarla."],
  ["Habitar", "Dejar que el tiempo la complete."],
];
export function Development() {
  return <section id="desarrollo" className="development" aria-labelledby="development-title"><header><p className="eyebrow">04 — Desarrollo</p><h2 id="development-title">Del territorio<br /><em>a la obra.</em></h2></header><ol>{stages.map(([stage, description], index) => <li key={stage}><span>0{index + 1}</span><strong>{stage}</strong><p>{description}</p><i /></li>)}</ol><p className="development__note">Arquitectura y desarrollo como un único proceso continuo.</p></section>;
}
