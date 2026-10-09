import Image from "next/image";

type ResponsiveMediaProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes: string;
};

export function ResponsiveMedia({ src, alt, className, priority = false, sizes }: ResponsiveMediaProps) {
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} quality={92} />;
}
