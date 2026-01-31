'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { convertToOutput } from '@/lib/shadow-live-adapter';
import type { Output } from '@/types';
import type {
  RecordingStatus,
  LabelsResponse,
  PatternsResponse,
} from '@/types/shadow-live';

interface UseShadowLiveReturn {
  isRecording: boolean;
  isAnalyzing: boolean;
  output: Output | null;
  error: string | null;
  recordingStatus: RecordingStatus | null;
  hasStartedRecording: boolean;
  startRecording: (duration: number) => Promise<void>;
  stopRecording: () => Promise<void>;
}

export function useShadowLive(): UseShadowLiveReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus | null>(null);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);
  const prevIsRecordingRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, labelsRes, patternsRes] = await Promise.all([
        fetch('/api/shadow/recording/status', { cache: 'no-store' }),
        fetch('/api/shadow/labels', { cache: 'no-store' }),
        fetch('/api/shadow/patterns', { cache: 'no-store' }),
      ]);

      if (!statusRes.ok) {
        throw new Error('상태 조회 실패');
      }

      const status: RecordingStatus = await statusRes.json();
      const labelsData: LabelsResponse = await labelsRes.json().catch(() => ({
        count: 0,
        labels: [],
      }));
      const patternsData: PatternsResponse = await patternsRes.json().catch(() => ({
        count: 0,
        patterns: [],
      }));

      setRecordingStatus(status);
      setIsRecording(status.is_recording);

      const hasLabels = (labelsData.labels || []).length > 0;
      const hasPatterns = (patternsData.patterns || []).length > 0;

      if (hasStartedRecording && (hasLabels || hasPatterns)) {
        const newOutput = convertToOutput(
          status,
          labelsData.labels || [],
          patternsData.patterns || []
        );
        setOutput(newOutput);
        setIsAnalyzing(false);
      } else if (!hasStartedRecording) {
        setOutput(null);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 조회 실패');
    }
  }, [hasStartedRecording]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const startRecording = useCallback(async (duration: number) => {
    try {
      setHasStartedRecording(true);
      const res = await fetch('/api/shadow/recording/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, monitor: 1, fps: 10 }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '녹화 시작 실패');
      }

      await fetchData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '녹화 시작 실패');
    }
  }, [fetchData]);

  const stopRecording = useCallback(async () => {
    try {
      const res = await fetch('/api/shadow/recording/stop', {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '녹화 중지 실패');
      }

      await fetchData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '녹화 중지 실패');
    }
  }, [fetchData]);

  const startAnalysis = useCallback(async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/shadow/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backend: 'claude' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '분석 시작 실패');
      }

      await fetchData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 시작 실패');
      setIsAnalyzing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    const wasRecording = prevIsRecordingRef.current;
    const hasSession = recordingStatus?.has_session;
    const hasFrames = (recordingStatus?.frame_count ?? 0) > 0;

    if (wasRecording && !isRecording && hasSession && hasFrames) {
      startAnalysis();
    }

    prevIsRecordingRef.current = isRecording;
  }, [isRecording, recordingStatus, startAnalysis]);

  return {
    isRecording,
    isAnalyzing,
    output,
    error,
    recordingStatus,
    hasStartedRecording,
    startRecording,
    stopRecording,
  };
}
