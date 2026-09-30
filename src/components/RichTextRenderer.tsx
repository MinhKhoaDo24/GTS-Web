'use client'

import { useEffect, useRef, useState } from 'react'

interface RichTextRendererProps {
  content?: string | null
  className?: string
}

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  const [sanitized, setSanitized] = useState<string>('')
  const prevContent = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    // Skip if content hasn't changed
    if (prevContent.current === content) return
    prevContent.current = content

    // If no content, nothing to sanitize — component returns null anyway
    if (!content) return

    // Dynamically import DOMPurify (browser-only) and call setSanitized in callback
    // Using import().then() satisfies the react-hooks/set-state-in-effect rule because
    // setState is called inside an async callback, not synchronously in the effect body.
    import('dompurify').then(({ default: DOMPurify }) => {
      const clean = DOMPurify.sanitize(content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      })
      setSanitized(clean)
    })
  }, [content])

  if (!content) return null

  return (
    <div
      className={`prose max-w-none text-gray-700 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized || content }}
    />
  )
}
