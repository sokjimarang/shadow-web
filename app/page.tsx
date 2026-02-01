"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero 섹션 */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
          AI에게 일을 시키는 첫 단계는,
          <br />
          AI가 당신의 일을 이해하는 것
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          말로 설명하지 마세요. 그냥 일하세요.
          <br />
          Shadow가 보고 배웁니다.
        </p>
        <div className="mt-10 flex gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href="/output-live">시작하기</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href="/output/1">데모 보기</Link>
          </Button>
        </div>
      </section>

      {/* 문제 정의 섹션 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">
            AI에게 일을 맡기기 어려운 이유
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            AI 에이전트 시대가 다가오고 있지만, 대부분의 사람들은 멈춥니다
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* 왼쪽: 문제 */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-6">
                <div className="mb-4 text-2xl">X</div>
                <h3 className="text-xl font-semibold text-primary">
                  &ldquo;어떻게 일하세요?&rdquo;
                </h3>
                <p className="mt-2 text-muted-foreground">
                  열린 질문에 대답하기 어렵습니다.
                  <br />
                  본인도 자신의 업무 방식을 모르기 때문입니다.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>- 판단 기준을 설명하기 어려움</li>
                  <li>- 품질 기준을 언어화하지 못함</li>
                  <li>- 암묵지를 끌어내기 힘듦</li>
                </ul>
              </CardContent>
            </Card>

            {/* 오른쪽: 해결책 */}
            <Card className="border-primary/30 bg-primary-lighter">
              <CardContent className="p-6">
                <div className="mb-4 text-2xl">O</div>
                <h3 className="text-xl font-semibold text-primary">
                  &ldquo;이렇게 하신 것 같은데 맞나요?&rdquo;
                </h3>
                <p className="mt-2 text-muted-foreground">
                  닫힌 질문에는 쉽게 대답할 수 있습니다.
                  <br />
                  AI가 먼저 관찰하고 가설을 제시합니다.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>- 구체적 상황에서 확인</li>
                  <li>- 암묵지도 자연스럽게 드러남</li>
                  <li>- 지속적으로 업데이트되는 문서</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 솔루션 섹션 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Shadow가 해결합니다
          </h2>
          <p className="mt-4 text-muted-foreground">
            사용자의 반복적인 업무 패턴을 관찰하여
            <br />
            에이전트 명세서를 자동 생성합니다
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-lighter">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">
                그냥 일하세요
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Shadow가 그림자처럼 조용히
                <br />
                업무를 관찰합니다
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-lighter">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">
                패턴 발견
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                30회 이상 반복되는 패턴을
                <br />
                자동으로 감지합니다
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-lighter">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">
                명세서 생성
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                간단한 확인 질문 후
                <br />
                에이전트 명세서가 완성됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 작동 방식 섹션 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">
            작동 방식
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            5단계 순환 구조로 명세서를 점진적으로 완성합니다
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {[
              { step: "OBSERVE", label: "관찰", desc: "화면과 행동을 수집" },
              { step: "ANALYZE", label: "분석", desc: "패턴과 규칙을 추론" },
              { step: "CLARIFY", label: "확인", desc: "불확실한 부분 질문" },
              { step: "PROCESS", label: "처리", desc: "응답을 명세서에 반영" },
              { step: "NOTIFY", label: "알림", desc: "업데이트 완료 알림" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <Card className="w-36 transition-shadow hover:shadow-md">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.step}
                    </p>
                    <p className="mt-1 text-lg font-bold text-primary">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
                {index < 4 && (
                  <span className="mx-2 text-2xl text-muted-foreground">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HITL 섹션 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">
            Human-in-the-Loop
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            AI가 추론한 내용을 사람이 확인하여 정확한 명세서를 만듭니다
          </p>

          <div className="mt-12 space-y-4">
            {[
              {
                type: "가설 검증",
                example:
                  '"금액이 100만원 넘으면 상사 확인을 받으시는 것 같은데, 맞나요?"',
                purpose: "판단 기준 확정",
              },
              {
                type: "품질 확인",
                example:
                  '"결과물에 항상 날짜를 넣으시는데, 필수 요소인가요?"',
                purpose: "품질 기준 확정",
              },
            ].map((item) => (
              <Card key={item.type}>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-lighter">
                    <span className="text-sm font-bold text-primary">Q</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary-lighter px-2 py-0.5 text-xs font-medium text-primary">
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.purpose}
                      </span>
                    </div>
                    <p className="mt-2 text-primary">{item.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 산출물 섹션 */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">
            산출물: 에이전트 명세서
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            AI 에이전트가 업무를 수행하는 데 필요한 모든 정보를 담은 문서
          </p>

          <Card className="mt-12">
            <CardContent className="p-6">
              <pre className="overflow-x-auto rounded-lg bg-primary-lighter p-4 text-sm">
                <code className="text-primary">
                  {`spec.json
├── meta: 이름, 버전, 생성일
├── trigger: 언제 이 업무가 시작되는가
├── workflow: 어떤 단계로 진행되는가
├── decisions: 판단 기준 (HITL로 확인된 규칙)
├── boundaries: always_do / ask_first / never_do
├── quality: 결과물 필수 요소
└── exceptions: 예외 처리`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            위임의 시작, Shadow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            더 이상 설명하지 마세요.
            <br />
            그냥 일하면 AI가 배웁니다.
          </p>
          <div className="mt-10">
            <Button size="lg" className="px-12" asChild>
              <Link href="/output-live">지금 시작하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>Shadow - 위임의 시작</p>
        </div>
      </footer>
    </main>
  );
}
