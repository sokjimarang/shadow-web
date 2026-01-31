import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{output.title}</h1>
          <p className="text-sm text-muted-foreground">
            Created at: {new Date(output.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>

        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-primary">Shadow</span>
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

      {/* Dashboard Layout */}
      <OutputDashboardLayout output={output} />
    </div>
  );
}
