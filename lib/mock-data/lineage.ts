import { LineageEdge } from "./types";

export const lineageEdges: LineageEdge[] = [
  // Sources → Staging
  { source: "model-src-orders", target: "model-stg-orders" },
  { source: "model-src-customers", target: "model-stg-customers" },
  { source: "model-src-payments", target: "model-stg-payments" },
  { source: "model-src-products", target: "model-stg-products" },

  // Staging → Intermediate
  { source: "model-stg-orders", target: "model-int-order-payments" },
  { source: "model-stg-payments", target: "model-int-order-payments" },
  { source: "model-stg-orders", target: "model-int-customer-orders" },
  { source: "model-stg-customers", target: "model-int-customer-orders" },

  // Staging / Intermediate → Dimensions
  { source: "model-stg-customers", target: "model-dim-customers" },
  { source: "model-int-customer-orders", target: "model-dim-customers" },
  { source: "model-stg-products", target: "model-dim-products" },

  // Staging / Intermediate / Dimensions → Facts
  { source: "model-stg-orders", target: "model-fct-orders" },
  { source: "model-int-order-payments", target: "model-fct-orders" },
  { source: "model-stg-products", target: "model-fct-orders" },
  { source: "model-dim-products", target: "model-fct-orders" },
  { source: "model-stg-payments", target: "model-fct-revenue" },
  { source: "model-int-order-payments", target: "model-fct-revenue" },

  // Facts / Dimensions → Metrics
  { source: "model-fct-orders", target: "model-metricstore-daily-revenue" },
  { source: "model-fct-revenue", target: "model-metricstore-daily-revenue" },
  { source: "model-dim-customers", target: "model-metricstore-daily-revenue" },
];
