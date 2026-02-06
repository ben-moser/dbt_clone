import { redirect } from "next/navigation"

export default function DeployJobsRedirect() {
  redirect("/orchestration/jobs")
}
