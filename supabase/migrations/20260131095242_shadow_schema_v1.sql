-- Shadow v1.1 Schema Migration
-- Date: 2026-01-31
-- Description: Complete schema update based on Shadow data model specification

-- =============================================================================
-- 1. SYSTEM LAYER
-- =============================================================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slack_user_id TEXT NOT NULL UNIQUE,
  slack_channel_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX users_slack_user_id_idx ON users(slack_user_id);

-- Configs table
CREATE TABLE configs (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  excluded_apps TEXT[] DEFAULT ARRAY[]::TEXT[],
  capture_interval_ms INTEGER DEFAULT 1000,
  min_pattern_occurrences INTEGER DEFAULT 3,
  hitl_max_questions INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update existing sessions table
ALTER TABLE sessions
  DROP COLUMN IF EXISTS duration,
  DROP COLUMN IF EXISTS frame_count,
  ADD COLUMN IF NOT EXISTS user_id_uuid UUID REFERENCES users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS observation_count INTEGER NOT NULL DEFAULT 0,
  ALTER COLUMN event_count SET DEFAULT 0,
  ALTER COLUMN status SET DEFAULT 'active';

-- Create index for new user_id_uuid
CREATE INDEX IF NOT EXISTS sessions_user_id_uuid_idx ON sessions(user_id_uuid);

COMMENT ON COLUMN sessions.user_id IS 'Deprecated: Use user_id_uuid instead';
COMMENT ON COLUMN sessions.user_id_uuid IS 'Reference to users table';

-- =============================================================================
-- 2. RAW DATA LAYER
-- =============================================================================

-- Screenshots table
CREATE TABLE screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('before', 'after')),
  data TEXT, -- base64 encoded (deleted after analysis)
  thumbnail TEXT NOT NULL, -- base64 encoded (preserved)
  resolution JSONB NOT NULL, -- {width: number, height: number}
  trigger_event_id UUID, -- will reference input_events
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX screenshots_session_id_idx ON screenshots(session_id);
CREATE INDEX screenshots_trigger_event_id_idx ON screenshots(trigger_event_id);
CREATE INDEX screenshots_timestamp_idx ON screenshots(timestamp DESC);

-- Input events table
CREATE TABLE input_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('mouse_click', 'mouse_move', 'key_press', 'key_release', 'scroll')),
  position JSONB, -- {x: number, y: number}
  button TEXT CHECK (button IN ('left', 'right', 'middle')),
  click_type TEXT CHECK (click_type IN ('single', 'double')),
  key TEXT,
  modifiers TEXT[] DEFAULT ARRAY[]::TEXT[],
  active_window JSONB NOT NULL, -- {title: string, app_name: string, app_bundle_id: string}
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX input_events_session_id_idx ON input_events(session_id);
CREATE INDEX input_events_type_idx ON input_events(type);
CREATE INDEX input_events_timestamp_idx ON input_events(timestamp DESC);

-- Add foreign key constraint to screenshots
ALTER TABLE screenshots
  ADD CONSTRAINT screenshots_trigger_event_id_fkey
  FOREIGN KEY (trigger_event_id) REFERENCES input_events(id) ON DELETE SET NULL;

-- Raw observations table
CREATE TABLE raw_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  before_screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
  after_screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES input_events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX raw_observations_session_id_idx ON raw_observations(session_id);
CREATE INDEX raw_observations_timestamp_idx ON raw_observations(timestamp DESC);

-- =============================================================================
-- 3. ANALYSIS LAYER
-- =============================================================================

-- Labeled actions table (replaces analysis_results)
CREATE TABLE labeled_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES raw_observations(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action_type TEXT NOT NULL CHECK (action_type IN ('click', 'type', 'copy', 'paste', 'scroll', 'navigate', 'select')),
  target_element TEXT NOT NULL,
  app TEXT NOT NULL,
  app_context TEXT,
  semantic_label TEXT NOT NULL,
  intent_guess TEXT,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX labeled_actions_observation_id_idx ON labeled_actions(observation_id);
CREATE INDEX labeled_actions_session_id_idx ON labeled_actions(session_id);
CREATE INDEX labeled_actions_action_type_idx ON labeled_actions(action_type);
CREATE INDEX labeled_actions_timestamp_idx ON labeled_actions(timestamp DESC);

-- Session sequences table
CREATE TABLE session_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  action_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  apps_used TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  action_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'recording' CHECK (status IN ('recording', 'completed', 'analyzed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX session_sequences_session_id_idx ON session_sequences(session_id);
CREATE INDEX session_sequences_status_idx ON session_sequences(status);
CREATE INDEX session_sequences_start_time_idx ON session_sequences(start_time DESC);

-- =============================================================================
-- 4. PATTERN LAYER
-- =============================================================================

-- Detected patterns table (replaces patterns)
CREATE TABLE detected_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  core_sequence JSONB NOT NULL DEFAULT '[]'::jsonb, -- ActionTemplate[]
  apps_involved TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  occurrences INTEGER NOT NULL DEFAULT 0,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  variations JSONB DEFAULT '[]'::jsonb, -- Variation[]
  uncertainties JSONB DEFAULT '[]'::jsonb, -- Uncertainty references
  status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'confirming', 'confirmed', 'rejected')),
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  spec_id UUID, -- will reference agent_specs
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX detected_patterns_status_idx ON detected_patterns(status);
CREATE INDEX detected_patterns_spec_id_idx ON detected_patterns(spec_id);
CREATE INDEX detected_patterns_first_seen_idx ON detected_patterns(first_seen DESC);

-- Uncertainties table
CREATE TABLE uncertainties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID NOT NULL REFERENCES detected_patterns(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('condition', 'exception', 'quality', 'alternative')),
  description TEXT NOT NULL,
  hypothesis TEXT,
  related_action_indices INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX uncertainties_pattern_id_idx ON uncertainties(pattern_id);
CREATE INDEX uncertainties_type_idx ON uncertainties(type);
CREATE INDEX uncertainties_resolved_idx ON uncertainties(resolved);

-- =============================================================================
-- 5. HITL LAYER
-- =============================================================================

-- HITL questions table
CREATE TABLE hitl_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID NOT NULL REFERENCES detected_patterns(id) ON DELETE CASCADE,
  uncertainty_id UUID NOT NULL REFERENCES uncertainties(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('anomaly', 'alternative', 'hypothesis', 'quality')),
  question_text TEXT NOT NULL,
  context TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- QuestionOption[]
  allows_freetext BOOLEAN NOT NULL DEFAULT FALSE,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'answered', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  slack_message_ts TEXT
);

CREATE INDEX hitl_questions_pattern_id_idx ON hitl_questions(pattern_id);
CREATE INDEX hitl_questions_uncertainty_id_idx ON hitl_questions(uncertainty_id);
CREATE INDEX hitl_questions_status_idx ON hitl_questions(status);
CREATE INDEX hitl_questions_priority_idx ON hitl_questions(priority DESC);

-- HITL answers table
CREATE TABLE hitl_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES hitl_questions(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('button', 'freetext')),
  selected_option_id TEXT,
  freetext TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX hitl_answers_question_id_idx ON hitl_answers(question_id);
CREATE INDEX hitl_answers_user_id_idx ON hitl_answers(user_id);

-- Interpreted answers table
CREATE TABLE interpreted_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES hitl_answers(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('add_rule', 'add_exception', 'set_quality', 'reject', 'needs_clarification')),
  spec_update JSONB, -- {path: string, operation: string, value: any}
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  applied BOOLEAN NOT NULL DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX interpreted_answers_answer_id_idx ON interpreted_answers(answer_id);
CREATE INDEX interpreted_answers_applied_idx ON interpreted_answers(applied);

-- =============================================================================
-- 6. SPEC LAYER
-- =============================================================================

-- Agent specs table
CREATE TABLE agent_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID NOT NULL REFERENCES detected_patterns(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX agent_specs_pattern_id_idx ON agent_specs(pattern_id);
CREATE INDEX agent_specs_version_idx ON agent_specs(version);
CREATE INDEX agent_specs_status_idx ON agent_specs(status);

-- Add foreign key constraint to detected_patterns
ALTER TABLE detected_patterns
  ADD CONSTRAINT detected_patterns_spec_id_fkey
  FOREIGN KEY (spec_id) REFERENCES agent_specs(id) ON DELETE SET NULL;

-- Spec histories table
CREATE TABLE spec_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spec_id UUID NOT NULL REFERENCES agent_specs(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  previous_version TEXT,
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  change_summary TEXT NOT NULL,
  changes JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL CHECK (source IN ('pattern_detection', 'hitl_answer', 'manual')),
  source_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX spec_histories_spec_id_idx ON spec_histories(spec_id);
CREATE INDEX spec_histories_version_idx ON spec_histories(version);
CREATE INDEX spec_histories_timestamp_idx ON spec_histories(timestamp DESC);

-- =============================================================================
-- 7. CLEANUP - Drop old tables
-- =============================================================================

-- Drop old analysis_results table (replaced by labeled_actions)
DROP TABLE IF EXISTS analysis_results CASCADE;

-- Drop old patterns table (replaced by detected_patterns)
DROP TABLE IF EXISTS patterns CASCADE;

-- =============================================================================
-- 8. TRIGGERS
-- =============================================================================

-- Trigger for configs updated_at
CREATE TRIGGER update_configs_updated_at
  BEFORE UPDATE ON configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for session_sequences updated_at
CREATE TRIGGER update_session_sequences_updated_at
  BEFORE UPDATE ON session_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for detected_patterns updated_at
CREATE TRIGGER update_detected_patterns_updated_at
  BEFORE UPDATE ON detected_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for uncertainties updated_at
CREATE TRIGGER update_uncertainties_updated_at
  BEFORE UPDATE ON uncertainties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for agent_specs updated_at
CREATE TRIGGER update_agent_specs_updated_at
  BEFORE UPDATE ON agent_specs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE input_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE labeled_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE uncertainties ENABLE ROW LEVEL SECURITY;
ALTER TABLE hitl_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hitl_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpreted_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spec_histories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- RLS Policies for configs
CREATE POLICY "Users can view their own config"
  ON configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own config"
  ON configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert configs"
  ON configs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for screenshots, input_events, raw_observations
-- (Allow based on session ownership)
CREATE POLICY "Users can view their session screenshots"
  ON screenshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = screenshots.session_id
      AND (sessions.user_id_uuid = auth.uid() OR sessions.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Service can insert screenshots"
  ON screenshots FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their session input events"
  ON input_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = input_events.session_id
      AND (sessions.user_id_uuid = auth.uid() OR sessions.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Service can insert input events"
  ON input_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their session observations"
  ON raw_observations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = raw_observations.session_id
      AND (sessions.user_id_uuid = auth.uid() OR sessions.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Service can insert observations"
  ON raw_observations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for labeled_actions and session_sequences
CREATE POLICY "Users can view their labeled actions"
  ON labeled_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = labeled_actions.session_id
      AND (sessions.user_id_uuid = auth.uid() OR sessions.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Service can insert labeled actions"
  ON labeled_actions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their session sequences"
  ON session_sequences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_sequences.session_id
      AND (sessions.user_id_uuid = auth.uid() OR sessions.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Service can manage session sequences"
  ON session_sequences FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for patterns and uncertainties
CREATE POLICY "Users can view all patterns"
  ON detected_patterns FOR SELECT
  USING (true);

CREATE POLICY "Service can manage patterns"
  ON detected_patterns FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view uncertainties"
  ON uncertainties FOR SELECT
  USING (true);

CREATE POLICY "Service can manage uncertainties"
  ON uncertainties FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for HITL layer
CREATE POLICY "Users can view their questions"
  ON hitl_questions FOR SELECT
  USING (true);

CREATE POLICY "Service can manage questions"
  ON hitl_questions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view answers"
  ON hitl_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their answers"
  ON hitl_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view interpreted answers"
  ON interpreted_answers FOR SELECT
  USING (true);

CREATE POLICY "Service can manage interpreted answers"
  ON interpreted_answers FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for specs
CREATE POLICY "Users can view specs"
  ON agent_specs FOR SELECT
  USING (true);

CREATE POLICY "Service can manage specs"
  ON agent_specs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view spec histories"
  ON spec_histories FOR SELECT
  USING (true);

CREATE POLICY "Service can insert spec histories"
  ON spec_histories FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- 10. COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'System users registered via Slack';
COMMENT ON TABLE configs IS 'User-specific configuration settings';
COMMENT ON TABLE screenshots IS 'Captured screen images (before/after)';
COMMENT ON TABLE input_events IS 'User input events (mouse, keyboard)';
COMMENT ON TABLE raw_observations IS 'Raw observation data combining screenshots and events';
COMMENT ON TABLE labeled_actions IS 'AI-labeled user actions from observations';
COMMENT ON TABLE session_sequences IS 'Sequences of labeled actions within sessions';
COMMENT ON TABLE detected_patterns IS 'Detected repetitive behavioral patterns';
COMMENT ON TABLE uncertainties IS 'Uncertain points requiring human clarification';
COMMENT ON TABLE hitl_questions IS 'Questions sent to users for clarification';
COMMENT ON TABLE hitl_answers IS 'User responses to HITL questions';
COMMENT ON TABLE interpreted_answers IS 'AI interpretation of user answers';
COMMENT ON TABLE agent_specs IS 'Generated agent specifications from patterns';
COMMENT ON TABLE spec_histories IS 'Version history of agent specifications';
