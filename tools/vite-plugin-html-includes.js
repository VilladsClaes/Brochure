import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Minimal HTML-partial-plugin til Vite.
 *
 * Understøtter inkludering af delte HTML-fragmenter med valgfrie variabler:
 *
 *   <!-- @include "src/partials/head.html" { "title": "Ture", "description": "..." } -->
 *
 * Variabler indsættes i fragmentet med {{navn}} (fx {{title}}).
 * Inkluderinger kan nestes (et fragment må inkludere et andet).
 */
const INCLUDE_RE = /<!--\s*@include\s+"([^"]+)"\s*(\{[\s\S]*?\})?\s*-->/g

export default function htmlIncludes({ root = process.cwd() } = {}) {
  function parseProps(json, rel) {
    if (!json) return {}
    try {
      return JSON.parse(json)
    } catch (err) {
      throw new Error(`Ugyldig JSON i @include "${rel}": ${err.message}`)
    }
  }

  function interpolate(html, vars) {
    return html.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key) => {
      const value = key.split('.').reduce((obj, part) => (obj == null ? obj : obj[part]), vars)
      return value == null ? '' : String(value)
    })
  }

  function expand(html) {
    return html.replace(INCLUDE_RE, (_, rel, json) => {
      const vars = parseProps(json, rel)
      const file = resolve(root, rel)
      let content
      try {
        content = readFileSync(file, 'utf8')
      } catch {
        throw new Error(`@include kunne ikke finde filen: ${rel}`)
      }
      return interpolate(expand(content), vars)
    })
  }

  return {
    name: 'eventur-html-includes',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => expand(html),
    },
  }
}
