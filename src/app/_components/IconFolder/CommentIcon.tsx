import React from 'react'

export default function CommentIcon({size}: {size: "large" | "small" | "medium"}) {
  const size_icon = size === "large" ? 30 : size === "medium" ? 24 : 18 
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size_icon} height={size_icon} viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path d="M10 3h4a8 8 0 010 16v3.5c-5-2-12-5-12-11.5a8 8 0 018-8zm2 14h2a6 6 0 000-12h-4a6 6 0 00-6 6c0 3.61 2.462 5.966 8 8.48V17z"></path>
</svg>
  )
}
