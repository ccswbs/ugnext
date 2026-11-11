// components/lazy-link.tsx
// Source: https://prismic.io/blog/nextjs-cache-components#4-prevent-unnecessary-prefetching

"use client"

import { useState, type ComponentProps } from "react"
import NextLink from "next/link"
import { isExternalUrl } from "@/lib/ug-utils";

type LazyLinkProps = ComponentProps<typeof NextLink>

export function LazyLink(props: LazyLinkProps) {
  // Destructure props so we can exclude Next.js props from anchor
  const { 
    as,
    href, 
    passHref, 
    prefetch, 
    replace, 
    scroll, 
    shallow, 
    onLoadCapture, 
    onNavigate, 
    ...anchorProps } = props;
  const [active, setActive] = useState(false)
  const url = props.href.toString();

  const onPointerEnter: LazyLinkProps["onPointerEnter"] = (...args) => {
    props.onPointerEnter?.(...args)
    setActive(true)
  }
  const onFocus: LazyLinkProps["onFocus"] = (...args) => {
    props.onFocus?.(...args)
    setActive(true)
  }
  
  return (
    isExternalUrl(url) ?
    <a href={url} {...anchorProps}>
      {props.children}
    </a> :
    <NextLink
      prefetch={active ? null : false}
      {...props}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    />
  )
}