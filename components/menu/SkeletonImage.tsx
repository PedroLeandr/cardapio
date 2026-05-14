"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface SkeletonImageProps extends Omit<ImageProps, "onLoad"> {
  skeletonClassName?: string
}

export function SkeletonImage({ className, skeletonClassName, ...props }: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div
          className={`absolute inset-0 skeleton-shimmer ${skeletonClassName ?? ""}`}
        />
      )}
      <Image
        {...props}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}
