import { redirect } from "next/navigation"

interface Props {
  params: { jobId: string }
}

export default function DeployJobDetailRedirect({ params }: Props) {
  redirect(`/orchestration/jobs/${params.jobId}`)
}
