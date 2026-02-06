"use client"

import { useState } from "react"
import { FileTree } from "@/components/develop/file-tree"
import { EditorPanel } from "@/components/develop/editor-panel"
import { ResultsPanel } from "@/components/develop/results-panel"

const fileContents: Record<string, string> = {
  "stg_orders.sql": `WITH source AS (
    SELECT * FROM {{ source('jaffle_shop', 'orders') }}
),

renamed AS (
    SELECT
        id AS order_id,
        user_id AS customer_id,
        order_date,
        status,
        _etl_loaded_at
    FROM source
)

SELECT * FROM renamed`,

  "stg_customers.sql": `WITH source AS (
    SELECT * FROM {{ source('jaffle_shop', 'customers') }}
),

renamed AS (
    SELECT
        id AS customer_id,
        first_name,
        last_name,
        email,
        created_at,
        _etl_loaded_at
    FROM source
)

SELECT * FROM renamed`,

  "stg_payments.sql": `WITH source AS (
    SELECT * FROM {{ source('stripe', 'payments') }}
),

renamed AS (
    SELECT
        id AS payment_id,
        order_id,
        payment_method,
        {{ cents_to_dollars('amount') }} AS amount,
        created_at AS payment_date
    FROM source
)

SELECT * FROM renamed`,

  "fct_orders.sql": `WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),

payments AS (
    SELECT * FROM {{ ref('int_order_payments') }}
),

final AS (
    SELECT
        orders.order_id,
        orders.customer_id,
        orders.order_date,
        orders.status,
        payments.total_amount
    FROM orders
    LEFT JOIN payments
        ON orders.order_id = payments.order_id
)

SELECT * FROM final`,

  "dim_customers.sql": `WITH customers AS (
    SELECT * FROM {{ ref('stg_customers') }}
),

customer_orders AS (
    SELECT * FROM {{ ref('int_customer_orders') }}
),

final AS (
    SELECT
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customers.email,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        customer_orders.number_of_orders,
        customer_orders.lifetime_value
    FROM customers
    LEFT JOIN customer_orders
        ON customers.customer_id = customer_orders.customer_id
)

SELECT * FROM final`,

  "cents_to_dollars.sql": `{% macro cents_to_dollars(column_name, precision=2) %}
    ROUND({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}`,

  "assert_positive_revenue.sql": `SELECT
    order_id,
    total_amount
FROM {{ ref('fct_orders') }}
WHERE total_amount < 0`,

  "dbt_project.yml": `name: 'jaffle_shop'
version: '1.0.0'
config-version: 2

profile: 'jaffle_shop'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]

target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"`,

  "packages.yml": `packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1
  - package: dbt-labs/codegen
    version: 0.12.1`,
}

function getFileContent(filename: string): string {
  return (
    fileContents[filename] ??
    `-- ${filename}\n-- No content available for this file.\n\nSELECT 1`
  )
}

export default function StudioPage() {
  const [selectedFile, setSelectedFile] = useState("stg_orders.sql")

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 0px)" }}
    >
      {/* Top: file tree + editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: File tree */}
        <div className="w-[250px] shrink-0 overflow-y-auto border-r bg-muted/20">
          <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Project Files
          </div>
          <FileTree onSelectFile={setSelectedFile} />
        </div>

        {/* Center panel: Editor */}
        <div className="flex-1 overflow-hidden">
          <EditorPanel
            filename={selectedFile}
            content={getFileContent(selectedFile)}
          />
        </div>
      </div>

      {/* Bottom panel: Results */}
      <div className="h-[200px] shrink-0 overflow-hidden">
        <ResultsPanel />
      </div>
    </div>
  )
}
