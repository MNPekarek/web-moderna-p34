import { ResponsiveMedia } from "@/components/responsive-media";

type MaskedMediaProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function MaskedMedia({ src, alt, priority = false, className = "", imageClassName = "" }: MaskedMediaProps) {
  return (
    <div className={`masked-media ${className}`} data-masked-media>
      <ResponsiveMedia src={src} alt={alt} priority={priority} sizes="100vw" className={imageClassName} />
      <div className="masked-media__shutters" aria-hidden="true"><span /><span /><span /></div>
    </div>
  );
}
