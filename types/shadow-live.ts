/**
 * shadow-py API 응답 타입 정의
 */

export interface RecordingStatus {
  is_recording: boolean;
  has_session: boolean;
  frame_count: number;
  event_count: number;
  duration: number;
}

export interface ShadowPyLabel {
  action_type: string;
  target_element: string;
  app: string;
  app_context: string;
  semantic_label: string;
  intent_guess: string;
  confidence: number;
}

export interface ShadowPyPattern {
  name: string;
  description: string;
  actions: ShadowPyLabel[];
  occurrences: number[][];
  count: number;
  confidence: number;
  uncertainties: Array<{
    type: string;
    description: string;
    hypothesis: string;
  }>;
}

export interface ShadowStatus {
  status: string;
  recording: RecordingStatus;
  has_labels: boolean;
  has_patterns: boolean;
  is_analyzing: boolean;
}

export interface LabelsResponse {
  count: number;
  labels: ShadowPyLabel[];
}

export interface PatternsResponse {
  count: number;
  patterns: ShadowPyPattern[];
}

export interface RecordingStartRequest {
  duration: number;
  monitor?: number;
  fps?: number;
}

export interface AnalyzeRequest {
  backend?: string;
}
