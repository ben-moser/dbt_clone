import { Job } from "./types";

export const jobs: Job[] = [
  {
    id: "job-1",
    name: "Production Daily Run",
    environmentId: "env-3",
    schedule: "0 6 * * *",
    commands: [
      "dbt source freshness",
      "dbt build --select tag:daily --exclude tag:wip",
      "dbt run-operation upload_artifacts",
    ],
    lastRunStatus: "success",
    status: "passing",
  },
  {
    id: "job-2",
    name: "Production Hourly Incremental",
    environmentId: "env-3",
    schedule: "0 * * * *",
    commands: [
      "dbt build --select tag:incremental",
    ],
    lastRunStatus: "error",
    status: "failing",
  },
  {
    id: "job-3",
    name: "Staging Full Refresh",
    environmentId: "env-2",
    schedule: "0 4 * * 1",
    commands: [
      "dbt source freshness",
      "dbt build --full-refresh",
      "dbt test --select tag:staging",
    ],
    lastRunStatus: "success",
    status: "passing",
  },
  {
    id: "job-4",
    name: "CI Check",
    environmentId: "env-2",
    schedule: "",
    commands: [
      "dbt build --select state:modified+ --defer --state prod-manifest",
      "dbt test --select state:modified+",
    ],
    lastRunStatus: null,
    status: "never_run",
  },
  {
    id: "job-5",
    name: "Slim CI",
    environmentId: "env-1",
    schedule: "",
    commands: [
      "dbt build --select state:modified+ --defer --state prod-manifest --fail-fast",
    ],
    lastRunStatus: "success",
    status: "passing",
  },
];
