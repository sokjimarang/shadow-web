'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OutputPatternDiagram } from './output-pattern-diagram';
import { MarkdownRenderer } from './markdown-renderer';
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
              <CardTitle>Workflow Pattern</CardTitle>
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
            <OutputPatternDiagram nodes={pattern.nodes} edges={pattern.edges} />
          </CardContent>
        </Card>

        {/* Output Result */}
        <Card>
          <CardHeader>
            <CardTitle>Output Result</CardTitle>
            <p className="text-sm text-muted-foreground">
              Type: <Badge variant="outline">{result.type}</Badge>
            </p>
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

      {/* 우측: Markdown */}
      <div className="space-y-6">
        {/* Markdown 문서 */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={markdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
