import { CostEntry } from "./types"

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateCosts(): CostEntry[] {
  const entries: CostEntry[] = []

  for (let day = 1; day <= 30; day++) {
    const date = new Date(2025, 0, day)
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const dayOfWeek = date.getDay()

    const prodBase = 21 + seededRandom(day * 3) * 7 - 3.5
    const hourlyBase = 25 + seededRandom(day * 7) * 10 - 5
    const isMonday = dayOfWeek === 1
    const stagingBase = isMonday
      ? 9 + seededRandom(day * 11) * 6 - 3
      : 5 + seededRandom(day * 11) * 4 - 2

    entries.push({
      date: label,
      productionDaily: Math.round(prodBase * 100) / 100,
      hourlyIncremental: Math.round(hourlyBase * 100) / 100,
      stagingRefresh: Math.round(stagingBase * 100) / 100,
    })
  }

  return entries
}

export const dailyCosts: CostEntry[] = generateCosts()
