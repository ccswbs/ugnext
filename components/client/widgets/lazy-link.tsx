// components/lazy-link.tsx
// Source: https://prismic.io/blog/nextjs-cache-components#4-prevent-unnecessary-prefetching

"use client"

import { useState, type ComponentProps } from "react"
import NextLink from "next/link"

type LazyLinkProps = ComponentProps<typeof NextLink>

export function LazyLink(props: LazyLinkProps) {
  const [active, setActive] = useState(false)

  const onPointerEnter: LazyLinkProps["onPointerEnter"] = (...args) => {
    props.onPointerEnter?.(...args)
    setActive(true)
  }
  const onFocus: LazyLinkProps["onFocus"] = (...args) => {
    props.onFocus?.(...args)
    setActive(true)
  }
  
  return (
    <NextLink
      prefetch={active ? null : false}
      {...props}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    />
  )
}