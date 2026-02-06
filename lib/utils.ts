import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function statusColor(status: string): string {
  switch (status) {
    case "success":
    case "passing":
    case "pass":
      return "bg-green-100 text-green-800"
    case "error":
    case "failing":
    case "fail":
      return "bg-red-100 text-red-800"
    case "running":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
    case "never_run":
      return "bg-gray-100 text-gray-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

export function statusDot(status: string): string {
  switch (status) {
    case "success":
    case "passing":
    case "pass":
      return "bg-green-500"
    case "error":
    case "failing":
    case "fail":
      return "bg-red-500"
    case "running":
      return "bg-yellow-500"
    case "cancelled":
    case "never_run":
      return "bg-gray-400"
    default:
      return "bg-gray-400"
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  return `${hours}h ${remainMins}m`
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function timeAgo(iso: string): string {
  const now = new Date()
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
