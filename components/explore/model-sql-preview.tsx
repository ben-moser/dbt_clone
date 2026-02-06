"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModelSqlPreviewProps {
  sql: string
}

/** Simple keyword-based color map for SQL syntax highlighting approximation. */
function highlightSql(line: string): React.ReactNode[] {
  const keywords =
    /\b(select|from|where|with|as|join|left|right|inner|outer|cross|on|group\s+by|order\s+by|having|limit|union|all|distinct|case|when|then|else|end|and|or|not|in|is|null|true|false|insert|into|values|update|set|delete|create|drop|alter|table|view|index|if|exists|between|like|coalesce|count|sum|avg|min|max|string_agg|lower|trim|using)\b/gi
  const jinja = /(\{\{.*?\}\}|\{%.*?%\})/g
  const comments = /(--.*$)/gm
  const strings = /('(?:[^'\\]|\\.)*')/g

  // Split the line by patterns and wrap in styled spans
  const tokens: React.ReactNode[] = []
  let remaining = line
  let key = 0

  // Regex-based simple tokenizer: process from left to right
  const combinedPattern =
    /(--.*$)|(\{\{.*?\}\}|\{%.*?%\})|('(?:[^'\\]|\\.)*')|(\b(?:select|from|where|with|as|join|left|right|inner|outer|cross|on|group\s+by|order\s+by|having|limit|union|all|distinct|case|when|then|else|end|and|or|not|in|is|null|true|false|insert|into|values|update|set|delete|create|drop|alter|table|view|index|if|exists|between|like|coalesce|count|sum|avg|min|max|string_agg|lower|trim|using)\b)/gi

  let match: RegExpExecArray | null
  let lastIndex = 0

  while ((match = combinedPattern.exec(line)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      tokens.push(
        <span key={key++}>{line.slice(lastIndex, match.index)}</span>
      )
    }

    const text = match[0]

    if (match[1]) {
      // Comment
      tokens.push(
        <span key={key++} className="text-gray-500 italic">
          {text}
        </span>
      )
    } else if (match[2]) {
      // Jinja
      tokens.push(
        <span key={key++} className="text-orange-400">
          {text}
        </span>
      )
    } else if (match[3]) {
      // String
      tokens.push(
        <span key={key++} className="text-green-400">
          {text}
        </span>
      )
    } else if (match[4]) {
      // SQL keyword
      tokens.push(
        <span key={key++} className="text-blue-400 font-semibold">
          {text}
        </span>
      )
    }

    lastIndex = match.index + text.length
  }

  // Remaining text
  if (lastIndex < line.length) {
    tokens.push(<span key={key++}>{line.slice(lastIndex)}</span>)
  }

  return tokens.length > 0 ? tokens : [<span key={0}>{line}</span>]
}

export function ModelSqlPreview({ sql }: ModelSqlPreviewProps) {
  const [copied, setCopied] = useState(false)

  const lines = sql.split("\n")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border bg-gray-950 text-gray-100">
      {/* Copy button */}
      <div className="absolute right-3 top-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code block */}
      <div className="overflow-x-auto p-4 pr-24">
        <pre className="font-mono text-sm leading-relaxed">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="mr-4 inline-block w-8 select-none text-right text-gray-600">
                  {index + 1}
                </span>
                <span>{highlightSql(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
