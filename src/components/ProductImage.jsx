import { useState } from 'react'

export function ProductImage({ src, alt = '', className, width, height }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span className={className ? `${className} photo-fallback` : 'photo-fallback'} role="img" aria-label={alt || 'الصورة غير متاحة'}>
        الصورة غير متاحة
      </span>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
