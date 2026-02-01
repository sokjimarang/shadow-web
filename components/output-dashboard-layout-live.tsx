'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowDiagram } from './workflow-diagram';
import { MarkdownRenderer } from './markdown-renderer';
import {
  SkeletonBehaviourGraph,
  SkeletonOutputResult,
  SkeletonDocumentation,
} from '@/components/skeletons/skeleton-dashboard';
import type { Output } from '@/types';

interface OutputDashboardLayoutLiveProps {
  output: Output;
  isLoading?: boolean;
}

export function OutputDashboardLayoutLive({ output, isLoading = false }: OutputDashboardLayoutLiveProps) {
  const { pattern, markdown, result, metadata } = output;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Behaviour Pattern</CardTitle>
              {metadata?.status && (
                <Badge
                  variant={
                    metadata.status === 'completed'
                      ? 'default'
                      : metadata.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {metadata.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonBehaviourGraph />
            ) : pattern.nodes.length > 0 ? (
              <WorkflowDiagram nodes={pattern.nodes} edges={pattern.edges} isLive={true} />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <p>분석 결과가 없습니다. 충분한 데이터를 수집한 후 다시 시도해주세요.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Result</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Type:</span>
              <Badge variant="outline">{result.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonOutputResult />
            ) : result.content ? (
              result.type === 'json' ? (
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(result.content), null, 2);
                      } catch {
                        return result.content;
                      }
                    })()}
                  </code>
                </pre>
              ) : result.type === 'html' ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: result.content }}
                />
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                  {result.content}
                </div>
              )
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                아직 분석된 데이터가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonDocumentation />
            ) : markdown ? (
              <MarkdownRenderer content={markdown} />
            ) : (
              <div className="text-muted-foreground">
                <h3 className="font-semibold mb-2">분석 결과</h3>
                <p>아직 패턴이 감지되지 않았습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
