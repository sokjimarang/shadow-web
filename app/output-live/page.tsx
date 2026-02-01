'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OutputDashboardLayoutLive } from '@/components/output-dashboard-layout-live';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShadowLive } from '@/hooks/use-shadow-live';
import { SkeletonDashboard } from '@/components/skeletons/skeleton-dashboard';

export default function OutputLivePage() {
  const {
    isRecording,
    isAnalyzing,
    output,
    error,
    recordingStatus,
    hasStartedRecording,
    startRecording,
    stopRecording,
  } = useShadowLive();

  const [recordingDuration, setRecordingDuration] = useState(30);

  const handleStartRecording = async () => {
    await startRecording(recordingDuration);
  };

  const handleStopRecording = async () => {
    await stopRecording();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
            <Link href="/">&larr; 홈으로</Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Shadow Live Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            실시간 분석 진행 상황
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-primary">Shadow</span>
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-primary">
            <Image
              src="/logo.png"
              alt="Shadow Logo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-medium">오류 발생</p>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Control</CardTitle>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  🔴 녹화 중
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAnalyzing && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">녹화 시간 (초):</label>
                  <input
                    type="number"
                    value={recordingDuration}
                    onChange={(e) => setRecordingDuration(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                    min={5}
                    max={300}
                    disabled={isRecording}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    variant={isRecording ? 'secondary' : 'default'}
                  >
                    녹화 시작
                  </Button>
                  <Button
                    onClick={handleStopRecording}
                    disabled={!isRecording}
                    variant="outline"
                  >
                    녹화 중지
                  </Button>
                </div>
                {hasStartedRecording && recordingStatus && (
                  <div className="text-sm space-y-1 pt-2 border-t">
                    <p>
                      <span className="font-medium">프레임:</span>{' '}
                      {recordingStatus.frame_count}개
                    </p>
                    <p>
                      <span className="font-medium">이벤트:</span>{' '}
                      {recordingStatus.event_count}개
                    </p>
                    <p>
                      <span className="font-medium">녹화 시간:</span>{' '}
                      {recordingStatus.duration.toFixed(1)}초
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {isAnalyzing ? (
        <SkeletonDashboard />
      ) : output ? (
        <OutputDashboardLayoutLive output={output} isLoading={false} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              녹화를 시작하면 실시간 분석 결과가 여기에 표시됩니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
