"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type SectionImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
};

function SectionImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  objectFit = "cover",
}: SectionImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] bg-brand-cream-200", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          objectFit === "contain" ? "object-contain" : "object-cover object-center",
          imageClassName,
        )}
        onError={(event) => {
          const target = event.currentTarget;
          target.src = "/images/brand/logo-pawpair-icon.png";
          target.srcset = "";
          target.className = cn("object-contain p-10 opacity-40", imageClassName);
        }}
      />
    </div>
  );
}

export { SectionImage };
