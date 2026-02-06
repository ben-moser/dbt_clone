import { PageHeader } from "@/components/layout/page-header"
import { ModelsTable } from "@/components/explore/models-table"
import { models } from "@/lib/mock-data/models"

export default function CatalogPage() {
  return (
    <div>
      <PageHeader
        title="Catalog"
        description="Browse your dbt project models"
      />
      <div className="p-6">
        <ModelsTable models={models} />
      </div>
    </div>
  )
}
