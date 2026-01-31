import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OutputDashboardLayout } from '@/components/output-dashboard-layout';
import { getOutputById } from '@/constants/mock-outputs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const output = getOutputById(id);

  if (!output) {
    return {
      title: 'Not Found - Shadow Dashboard',
      description: '출력 결과를 찾을 수 없습니다',
    };
  }

  return {
    title: `${output.title} - Shadow Dashboard`,
    description: 'Shadow-py 출력 결과 대시보드',
  };
}

export default async function OutputPage({ params }: PageProps) {
  const { id } = await params;
  const output = getOutputById(id);

  if (!output) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{output.title}</h1>
        <p className="text-sm text-muted-foreground">
          Created at: {new Date(output.createdAt).toLocaleString('ko-KR')}
        </p>
      </div>

      {/* Dashboard Layout */}
      <OutputDashboardLayout output={output} />
    </div>
  );
}
