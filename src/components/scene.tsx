import type { ReactNode } from "react";

type SceneProps = { id: string; className?: string; children: ReactNode };

export function Scene({ id, className = "", children }: SceneProps) {
  return <section id={id} className={`scene ${className}`} data-scene={id}>{children}</section>;
}
