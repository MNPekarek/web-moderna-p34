type SplitTitleProps = { lines: string[]; className?: string };

export function SplitTitle({ lines, className = "" }: SplitTitleProps) {
  return (
    <h1 className={`split-title ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span className="split-title__line" aria-hidden="true" key={line}>
          <span className="split-title__inner" data-title-line>{line}</span>
        </span>
      ))}
    </h1>
  );
}
