import { redirect } from "next/navigation"

interface Props {
  params: { modelId: string }
}

export default function ExploreModelDetailRedirect({ params }: Props) {
  redirect(`/catalog/models/${params.modelId}`)
}
