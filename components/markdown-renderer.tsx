'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { DocumentationContent } from '@/types';

interface MarkdownRendererProps {
  content: DocumentationContent;
}

function resolveMarkdown(content: DocumentationContent): string {
  if (typeof content === 'string') {
    return content;
  }

  if (content && typeof content === 'object') {
    const fallback =
      typeof content.fullMarkdown === 'string'
        ? content.fullMarkdown
        : typeof content.markdown === 'string'
          ? content.markdown
          : '';

    if (fallback.trim().length > 0) {
      return fallback;
    }

    return `\`\`\`json\n${JSON.stringify(content, null, 2)}\n\`\`\``;
  }

  return '';
}

function stripAgentSpecSection(markdown: string): string {
  const headingRegex = /^##\s*4\.?\s*생성되는 에이전트 명세서\s*$/m;
  const headingMatch = headingRegex.exec(markdown);

  if (headingMatch) {
    const startIndex = headingMatch.index;
    const afterHeading = startIndex + headingMatch[0].length;
    const remaining = markdown.slice(afterHeading);
    const nextHeadingMatch = remaining.match(/^##\s+/m);
    const endIndex = nextHeadingMatch && nextHeadingMatch.index !== undefined
      ? afterHeading + nextHeadingMatch.index
      : markdown.length;

    return (markdown.slice(0, startIndex) + markdown.slice(endIndex)).trim();
  }

  let cleaned = markdown;
  const jsonBlockRegex = /```json\s*\n([\s\S]*?)\n```/g;
  let match: RegExpExecArray | null;

  while ((match = jsonBlockRegex.exec(markdown)) !== null) {
    const blockBody = match[1];
    const looksLikeAgentSpec =
      blockBody.includes('"meta"') &&
      blockBody.includes('"workflow"') &&
      blockBody.includes('"decisions"') &&
      blockBody.includes('"boundaries"') &&
      blockBody.includes('"quality"') &&
      blockBody.includes('"exceptions"') &&
      blockBody.includes('"tools"');

    if (looksLikeAgentSpec) {
      const blockStart = match.index;
      const blockEnd = match.index + match[0].length;
      cleaned =
        cleaned.slice(0, blockStart).replace(/\n{2,}$/, '\n\n') +
        cleaned.slice(blockEnd).replace(/^\n{2,}/, '\n\n');
      break;
    }
  }

  return cleaned.trim();
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const markdown = stripAgentSpecSection(resolveMarkdown(content));

  return (
    <div className="text-sm text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold text-primary mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-primary mt-6 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-6 text-foreground mb-3">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-6">{children}</li>,
          a: ({ children, href }) => (
            <a className="text-primary underline" href={href}>
              {children}
            </a>
          ),
          hr: () => <hr className="my-5 border-border" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground mb-3">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left font-semibold text-foreground px-3 py-2 border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="align-top px-3 py-2 border-b border-border">
              {children}
            </td>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs mb-4">
              {children}
            </pre>
          ),
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
