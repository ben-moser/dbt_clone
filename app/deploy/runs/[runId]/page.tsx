import { redirect } from "next/navigation"

interface Props {
  params: { runId: string }
}

export default function DeployRunDetailRedirect({ params }: Props) {
  redirect(`/orchestration/runs/${params.runId}`)
}
