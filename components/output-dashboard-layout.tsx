'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowDiagram } from './workflow-diagram';
import { MarkdownRenderer } from './markdown-renderer';
import { PatternAnalyticsDashboard } from './pattern-analytics-dashboard';
import type { Output } from '@/types';

interface OutputDashboardLayoutProps {
  output: Output;
}

export function OutputDashboardLayout({ output }: OutputDashboardLayoutProps) {
  const { pattern, markdown, result, metadata } = output;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 좌측: Pattern Diagram + Output Result */}
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
            <WorkflowDiagram nodes={pattern.nodes} edges={pattern.edges} />
          </CardContent>
        </Card>

        {/* Output Result */}
        <Card>
          <CardHeader>
            <CardTitle>Output Result</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Type:</span>
              <Badge variant="outline">{result.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {result.type === 'json' ? (
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {JSON.stringify(JSON.parse(result.content), null, 2)}
                </code>
              </pre>
            ) : result.type === 'html' ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: result.content }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-sm">{result.content}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 우측: Analytics Dashboard */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 데모 시나리오(id: 1)는 시각화된 대시보드 표시 */}
            {output.id === '1' ? (
              <PatternAnalyticsDashboard />
            ) : (
              <MarkdownRenderer content={markdown} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
