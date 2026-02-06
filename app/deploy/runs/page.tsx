import { redirect } from "next/navigation"

export default function DeployRunsRedirect() {
  redirect("/orchestration/runs")
}
