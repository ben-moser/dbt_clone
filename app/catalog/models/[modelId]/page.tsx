import { PageHeader } from "@/components/layout/page-header"
import { ModelDetailTabs } from "@/components/explore/model-detail-tabs"
import { models } from "@/lib/mock-data/models"

interface ModelDetailPageProps {
  params: { modelId: string }
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const model = models.find((m) => m.id === params.modelId)

  if (!model) {
    return (
      <div>
        <PageHeader title="Model not found" />
        <div className="p-6">
          <p className="text-muted-foreground">
            The model with ID &quot;{params.modelId}&quot; could not be found in
            the project.
          </p>
        </div>
      </div>
    )
  }

  // Resolve depends-on IDs to model objects
  const dependsOnModels = model.dependsOn
    .map((depId) => {
      const dep = models.find((m) => m.id === depId)
      return dep ? { id: dep.id, name: dep.name } : null
    })
    .filter(Boolean) as { id: string; name: string }[]

  // Resolve referenced-by IDs to model objects
  const referencedByModels = model.referencedBy
    .map((refId) => {
      const ref = models.find((m) => m.id === refId)
      return ref ? { id: ref.id, name: ref.name } : null
    })
    .filter(Boolean) as { id: string; name: string }[]

  return (
    <div>
      <PageHeader
        title={model.name}
        description={`${model.schema}.${model.database}`}
      />
      <div className="p-6">
        <ModelDetailTabs
          model={model}
          dependsOnModels={dependsOnModels}
          referencedByModels={referencedByModels}
        />
      </div>
    </div>
  )
}
