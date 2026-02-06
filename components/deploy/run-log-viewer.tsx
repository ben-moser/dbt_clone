"use client"

interface RunLogViewerProps {
  logs: string
}

export function RunLogViewer({ logs }: RunLogViewerProps) {
  return (
    <div
      className="overflow-auto rounded-md p-4 max-h-80"
      style={{ backgroundColor: "#1e1e1e" }}
    >
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-green-400">
        <code>{logs}</code>
      </pre>
    </div>
  )
}
