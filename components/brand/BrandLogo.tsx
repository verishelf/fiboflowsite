import Image from "next/image";
import type { ComponentProps } from "react";

type BrandLogoProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  /** Pixel width/height (logo is square). */
  size?: number;
};

export function BrandLogo({
  size = 36,
  className = "",
  width,
  height,
  priority,
  ...rest
}: BrandLogoProps) {
  const dim = width ?? height ?? size;
  return (
    <Image
      src="/fiboflow-logo.png"
      alt="FiboFlow"
      width={dim}
      height={dim}
      className={`object-contain ${className}`}
      priority={priority}
      {...rest}
    />
  );
}
