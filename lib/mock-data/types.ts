export interface Column {
  name: string;
  type: string;
  description: string;
  tests: string[];
}

export interface Model {
  id: string;
  name: string;
  schema: string;
  database: string;
  materialization: "table" | "view" | "incremental" | "ephemeral";
  description: string;
  tags: string[];
  columns: Column[];
  sql: string;
  dependsOn: string[];
  referencedBy: string[];
  testsPassing: number;
  testsFailing: number;
}

export interface Job {
  id: string;
  name: string;
  environmentId: string;
  schedule: string;
  commands: string[];
  lastRunStatus: "success" | "error" | "running" | "cancelled" | null;
  status: "passing" | "failing" | "never_run";
}

export interface RunStep {
  name: string;
  status: "success" | "error" | "skipped";
  logs: string;
  duration: number;
}

export interface Run {
  id: string;
  jobId: string;
  jobName: string;
  status: "success" | "error" | "running" | "cancelled";
  startedAt: string;
  finishedAt: string | null;
  duration: number;
  trigger: "scheduled" | "manual" | "git" | "api";
  steps: RunStep[];
}

export interface Environment {
  id: string;
  name: string;
  type: "development" | "staging" | "production";
  dbtVersion: string;
  targetDataset: string;
  credentials: string;
}

export interface ProjectMeta {
  name: string;
  account: string;
  repository: string;
  defaultBranch: string;
}

export interface LineageEdge {
  source: string;
  target: string;
}

export interface CostEntry {
  date: string;
  productionDaily: number;
  hourlyIncremental: number;
  stagingRefresh: number;
}
