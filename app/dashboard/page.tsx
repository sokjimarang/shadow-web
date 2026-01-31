'use client';

import { useState } from 'react';
import {
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  User,
  TrendingUp,
  Bell,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { WorkflowDiagram } from '@/components/workflow-diagram';

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">대시보드 UI 테스트</h1>
            <p className="text-muted-foreground mt-2">
              shadcn/ui + lucide-react + React Flow 통합 예시
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="default">기본</Badge>
            <Badge variant="secondary">보조</Badge>
            <Badge variant="destructive">중요</Badge>
            <Badge variant="outline">아웃라인</Badge>
          </div>
        </div>

        {/* 아이콘 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Lucide Icons 예시
            </CardTitle>
            <CardDescription>다양한 아이콘 라이브러리 사용</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <User className="w-6 h-6" />
              <Calendar className="w-6 h-6" />
              <Heart className="w-6 h-6" />
              <MessageSquare className="w-6 h-6" />
              <TrendingUp className="w-6 h-6" />
              <Bell className="w-6 h-6" />
              <Check className="w-6 h-6 text-primary" />
              <X className="w-6 h-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>통계 카드 1</CardTitle>
              <CardDescription>이번 달 활동</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">1,234</p>
              <p className="text-sm text-muted-foreground">전월 대비 +12%</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                자세히 보기
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>통계 카드 2</CardTitle>
              <CardDescription>사용자 참여도</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">89%</p>
              <p className="text-sm text-muted-foreground">평균 참여 시간: 5분</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                상세 분석
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>통계 카드 3</CardTitle>
              <CardDescription>완료된 작업</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">456</p>
              <p className="text-sm text-muted-foreground">목표 대비 92%</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                리포트 보기
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 모달 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog (모달) 예시</CardTitle>
            <CardDescription>shadcn/ui Dialog 컴포넌트 테스트</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>모달 열기</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>확인이 필요합니다</DialogTitle>
                  <DialogDescription>
                    이 작업을 계속 진행하시겠습니까? 이 동작은 되돌릴 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm">여기에 추가 내용을 입력할 수 있습니다.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>확인</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* 아코디언 */}
        <Card>
          <CardHeader>
            <CardTitle>Accordion 예시</CardTitle>
            <CardDescription>확장/축소 가능한 컨텐츠</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>첫 번째 항목</AccordionTrigger>
                <AccordionContent>
                  첫 번째 항목의 상세 내용입니다. 여기에 긴 텍스트나 다른
                  컴포넌트를 추가할 수 있습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>두 번째 항목</AccordionTrigger>
                <AccordionContent>
                  두 번째 항목의 상세 내용입니다. 각 항목은 독립적으로 열리고
                  닫힙니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>세 번째 항목</AccordionTrigger>
                <AccordionContent>
                  세 번째 항목의 상세 내용입니다. shadcn/ui의 Accordion 컴포넌트는
                  접근성을 고려하여 설계되었습니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* React Flow 워크플로우 다이어그램 */}
        <Card>
          <CardHeader>
            <CardTitle>React Flow 워크플로우</CardTitle>
            <CardDescription>
              FigJam 스타일의 노드 기반 다이어그램 (드래그 가능)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowDiagram />
          </CardContent>
        </Card>

        {/* 버튼 variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>다양한 버튼 스타일</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
