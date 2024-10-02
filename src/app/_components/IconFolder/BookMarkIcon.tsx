import React from 'react'

export default function BookMarkIcon({size}: {size: "large" | "small" | "medium"}) {
  const size_icon = size === "large" ? 30 : size === "medium" ? 24 : 18 

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size_icon} height={size_icon} viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1zm13 2H6v15.432l6-3.761 6 3.761V4z"></path>
</svg>
  )
}
