/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============================================================
// UIBenchKit demo API types
// ============================================================

/** Response from POST /api/uibenchkit/submit */
export interface UIBenchKitSubmitResponse {
  message: string;
  launched: boolean;
  run_id: string;
  model?: string;
  model_family?: string;
  method?: string;
  dataset?: string;
}

/** Response from POST /api/uibenchkit/stop-run */
export interface UIBenchKitStopRunResponse {
  message: string;
  run_id: string;
  completed_instances?: number;
  stopped_instances?: number;
  skipped_instances?: number;
  evaluation_started?: boolean;
}

/** Response from GET /api/uibenchkit/poll */
export interface UIBenchKitPollResponse {
  run_id: string;
  status: "pending" | "running" | "completed" | "failed" | "stopped";
  dataset?: string;
  model?: string;
  method?: string;
  running: string[];
  completed: string[];
  pending: string[];
  failed: string[];
  /** Maps failed instanceId -> error message */
  failed_details?: Record<string, string>;
  evaluation?: Record<string, unknown>;
  cost_estimate?: Record<string, unknown>;
}

/** Response from POST /api/uibenchkit/report */
export interface UIBenchKitReportResponse {
  report: {
    run_id: string;
    model: string;
    method: string;
    dataset?: string;
    total_instances: number;
    completed_instances: number;
    failed_instances: number;
    evaluation?: {
      metrics?: {
        clip?: { average?: number; scores?: Record<string, number> };
        code_similarity?: {
          average?: number;
          scores?: Record<string, number>;
        };
        fine_grained?: Record<string, unknown>;
      };
    };
    results?: {
      instances?: Record<
        string,
        { status: string; output_file?: string; error?: string | null }
      >;
    };
    token_usage?: Record<string, unknown>;
    cost_estimate?: Record<string, unknown>;
    created_at?: string;
    completed_at?: string;
  };
}

/** Response from GET /api/uibenchkit/health */
export interface UIBenchKitHealthResponse {
  status: string;
  version: string;
  supported_methods: string[];
  supported_model_families: string[];
  supported_model_versions: Record<string, { default: string; versions: string[] }>;
  supported_datasets: string[];
}

/** Response for fetching a generated HTML file */
export interface UIBenchKitResultFile {
  html: string;
  screenshotUrl?: string;
}

/** Response from GET /api/uibenchkit/result-image/:runId/:instanceId */
export interface UIBenchKitResultImageResponse {
  /** base64-encoded PNG screenshot */
  image: string;
}

/** Response from GET /api/uibenchkit/result-html/:runId/:instanceId */
export interface UIBenchKitResultHtmlResponse {
  html: string;
}


