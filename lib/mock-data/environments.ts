import { Environment } from "./types";

export const environments: Environment[] = [
  {
    id: "env-1",
    name: "Development",
    type: "development",
    dbtVersion: "1.7.4",
    targetDataset: "dbt_dev",
    credentials: "BigQuery — dev-project:us-central1",
  },
  {
    id: "env-2",
    name: "Staging",
    type: "staging",
    dbtVersion: "1.7.4",
    targetDataset: "dbt_staging",
    credentials: "BigQuery — staging-project:us-central1",
  },
  {
    id: "env-3",
    name: "Production",
    type: "production",
    dbtVersion: "1.7.4",
    targetDataset: "dbt_prod",
    credentials: "BigQuery — prod-project:us-central1",
  },
];
