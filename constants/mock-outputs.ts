import type { Output } from '@/types';

export const MOCK_OUTPUTS: Output[] = [
  {
    "id": "1",
    "title": "시나리오 1: PM의 Slack 문의 답변 자동화",
    "createdAt": "2026-01-31T21:17:32.633Z",
    "pattern": {
      "nodes": [
        {
          "id": "step_analyze_question",
          "type": "input",
          "data": {
            "label": "질문 분석\n키워드 추출"
          },
          "position": {
            "x": 250,
            "y": 0
          }
        },
        {
          "id": "step_classify",
          "type": "default",
          "data": {
            "label": "질문 유형 분류\n(스펙/일정/기타)"
          },
          "position": {
            "x": 250,
            "y": 100
          }
        },
        {
          "id": "step_search_jira",
          "type": "default",
          "data": {
            "label": "JIRA 검색"
          },
          "position": {
            "x": 100,
            "y": 220
          }
        },
        {
          "id": "step_search_drive",
          "type": "default",
          "data": {
            "label": "Drive 검색"
          },
          "position": {
            "x": 400,
            "y": 220
          }
        },
        {
          "id": "step_read_jira",
          "type": "default",
          "data": {
            "label": "JIRA 티켓\n내용 확인"
          },
          "position": {
            "x": 100,
            "y": 340
          }
        },
        {
          "id": "step_read_drive",
          "type": "default",
          "data": {
            "label": "Drive 문서\n내용 추출"
          },
          "position": {
            "x": 400,
            "y": 340
          }
        },
        {
          "id": "step_check_sufficient",
          "type": "default",
          "data": {
            "label": "정보 충분성 판단"
          },
          "position": {
            "x": 250,
            "y": 460
          }
        },
        {
          "id": "step_additional_search",
          "type": "default",
          "data": {
            "label": "추가 검색\n(Notion/Confluence)"
          },
          "position": {
            "x": 550,
            "y": 460
          }
        },
        {
          "id": "step_merge_info",
          "type": "default",
          "data": {
            "label": "정보 병합 및\n우선순위 결정"
          },
          "position": {
            "x": 250,
            "y": 580
          }
        },
        {
          "id": "step_compose_reply",
          "type": "default",
          "data": {
            "label": "답변 작성"
          },
          "position": {
            "x": 250,
            "y": 700
          }
        },
        {
          "id": "step_check_quality",
          "type": "default",
          "data": {
            "label": "답변 품질 검증\n(링크 포함 여부)"
          },
          "position": {
            "x": 250,
            "y": 820
          }
        },
        {
          "id": "step_revise",
          "type": "default",
          "data": {
            "label": "답변 수정"
          },
          "position": {
            "x": 550,
            "y": 820
          }
        },
        {
          "id": "step_send_reply",
          "type": "output",
          "data": {
            "label": "답변 전송"
          },
          "position": {
            "x": 250,
            "y": 940
          }
        }
      ],
      "edges": [
        {
          "id": "e0-1",
          "source": "step_analyze_question",
          "target": "step_classify",
          "animated": true
        },
        {
          "id": "e1-2a",
          "source": "step_classify",
          "target": "step_search_jira",
          "animated": true,
          "label": "병렬 검색"
        },
        {
          "id": "e1-2b",
          "source": "step_classify",
          "target": "step_search_drive",
          "animated": true,
          "label": "병렬 검색"
        },
        {
          "id": "e2-3",
          "source": "step_search_jira",
          "target": "step_read_jira",
          "animated": true
        },
        {
          "id": "e2-4",
          "source": "step_search_drive",
          "target": "step_read_drive",
          "animated": true
        },
        {
          "id": "e3-5a",
          "source": "step_read_jira",
          "target": "step_check_sufficient",
          "animated": true
        },
        {
          "id": "e4-5b",
          "source": "step_read_drive",
          "target": "step_check_sufficient",
          "animated": true
        },
        {
          "id": "e5-6",
          "source": "step_check_sufficient",
          "target": "step_merge_info",
          "animated": true,
          "label": "충분"
        },
        {
          "id": "e5-7",
          "source": "step_check_sufficient",
          "target": "step_additional_search",
          "animated": true,
          "label": "불충분"
        },
        {
          "id": "e7-5",
          "source": "step_additional_search",
          "target": "step_check_sufficient",
          "animated": true,
          "label": "재검증",
          "type": "smoothstep"
        },
        {
          "id": "e6-8",
          "source": "step_merge_info",
          "target": "step_compose_reply",
          "animated": true
        },
        {
          "id": "e8-9",
          "source": "step_compose_reply",
          "target": "step_check_quality",
          "animated": true
        },
        {
          "id": "e9-10",
          "source": "step_check_quality",
          "target": "step_send_reply",
          "animated": true,
          "label": "통과"
        },
        {
          "id": "e9-11",
          "source": "step_check_quality",
          "target": "step_revise",
          "animated": true,
          "label": "미흡"
        },
        {
          "id": "e11-8",
          "source": "step_revise",
          "target": "step_compose_reply",
          "animated": true,
          "label": "재작성",
          "type": "smoothstep"
        }
      ]
    },
    "markdown": "# 행동 패턴 분석 리포트\n\n## 데이터 수집 요약\n\n| 지표 | 값 |\n|------|----|\n| 관찰 기간 | 2026.01.15 - 2026.01.31 |\n| 총 세션 수 | 47회 |\n| 총 이벤트 수 | 1,284건 |\n| 패턴 감지 | 3회 반복 후 |\n| 신뢰도 | 94.2% |\n\n---\n\n## 앱 사용 비율\n\n```\nSlack         ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  42.3%\nJIRA          ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  32.6%\nGoogle Drive  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25.1%\n```\n\n| 앱 | 사용 시간 | 전환 횟수 |\n|----|----------|----------|\n| Slack | 18분 32초 | 94회 |\n| JIRA | 14분 17초 | 89회 |\n| Google Drive | 11분 04초 | 67회 |\n\n---\n\n## 앱 전환 흐름\n\n```\n              ┌─────────────────────────────────────┐\n              │           앱 전환 빈도              │\n              └─────────────────────────────────────┘\n\n         Slack ──────(78회)──────▶ JIRA\n           ▲                        │\n           │                        │\n        (58회)                   (61회)\n           │                        │\n           │                        ▼\n         Drive ◀────────────────────┘\n\n```\n\n---\n\n## 질문 유형 분포\n\n```\n스펙 확인     ████████████████████████████░░░░░░░░░░░░░░░░░░░░  58.5%  (127건)\n일정 문의     █████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25.8%  (56건)\n담당자 확인   █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   9.7%  (21건)\n기타          ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   6.0%  (13건)\n```\n\n---\n\n## 단계별 소요 시간\n\n```\n질문 분석        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   8.2초\n유형 분류        █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   2.1초\nJIRA 검색        ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  12.4초\nDrive 검색       ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  14.7초\n티켓 내용 확인   ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  38.6초\n문서 내용 확인   ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  45.2초\n충분성 판단      █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   4.3초\n답변 작성        █████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  67.8초\n품질 검증        █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   5.6초\n─────────────────────────────────────────────────────────────────\n전체 평균        ████████████████████████████████████████████░░  4분 10초\n```\n\n---\n\n## 분기 발생 통계\n\n### 정보 충분성 판단\n\n```\n충분 → 바로 답변    ██████████████████████████████████████░░░░░░  77.4% (168회)\n불충분 → 추가 검색  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  22.6% (49회)\n```\n\n### 답변 품질 검증\n\n```\n통과 → 전송         ███████████████████████████████████████████░  87.1% (189회)\n미흡 → 수정         ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  12.9% (28회)\n```\n\n---\n\n## 예외 상황 발생\n\n```\n다중 매칭 (3건+)    █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  10.6% (23회)\n검색 결과 0건       ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   5.5% (12회)\n오래된 문서         ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   3.7% (8회)\n긴급/장애           █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   1.8% (4회)\n기밀 문서           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0.9% (2회)\n```\n\n| 예외 | 처리 방식 |\n|------|----------|\n| 다중 매칭 | PM 선택 요청 |\n| 검색 결과 0건 | PM 확인 요청 |\n| 오래된 문서 | 최신 여부 확인 |\n| 긴급/장애 | 즉시 에스컬레이션 |\n| 기밀 문서 | PM 승인 대기 |\n\n---\n\n## 규칙 확정 현황\n\n```\n규칙                              관찰    일관성    상태\n────────────────────────────────────────────────────────\nJIRA 링크 필수 포함               217회   ████████████████████ 100%   ✓ 확정\n핵심 내용 요약 포함               217회   ████████████████████ 100%   ✓ 확정\n스펙→JIRA+Drive 병렬 검색         127회   ███████████████████░  98%   ✓ 확정\n스펙 질문에 Drive 링크 포함       124회   ███████████████████░  98%   ✓ 확정\n기능명+동작 키워드 추출           203회   ███████████████████░  96%   ✓ 확정\n긴급/장애 에스컬레이션              4회   ████████████████████ 100%   ◐ 추론\n6개월+ 문서 최신 확인               8회   █████████████████░░░  88%   ◐ 추론\n```\n\n---\n\n## 자동화 예상 효과\n\n```\n                      현재          자동화 후       개선\n───────────────────────────────────────────────────────────\n평균 처리 시간        4분 10초   →   23초          ▼ 90.8%\n일일 처리량           18건       →   180건+        ▲ 900%\nPM 개입 필요          100%       →   18.8%         ▼ 81.2%\n응답 일관성           78%        →   99%+          ▲ 26.9%\n```\n\n---\n\n## 종합 신뢰도\n\n```\n패턴 일관성       █████████████████████████████████████████████████░  96.8%\n규칙 커버리지     ██████████████████████████████████████████████░░░░  92.1%\n예외 처리 완성도  ████████████████████████████████████████████░░░░░░  89.4%\n사용자 확인율     ███████████████████████████████████████████░░░░░░░  85.7%\n─────────────────────────────────────────────────────────────────────\n종합 신뢰도       ███████████████████████████████████████████████░░░  94.2%\n```\n",
    "result": {
      "type": "json",
      "content": "{\n  \"meta\": {\n    \"id\": \"spec_pm_001\",\n    \"name\": \"Slack 문의 답변 자동화\",\n    \"description\": \"JIRA와 Google Drive를 검색하여 Slack 문의에 답변\",\n    \"version\": \"1.2.0\",\n    \"status\": \"active\"\n  },\n  \"trigger\": {\n    \"description\": \"Slack #product-questions 채널에 질문이 올라올 때\",\n    \"conditions\": [\n      {\n        \"type\": \"app_event\",\n        \"app\": \"Slack\",\n        \"event\": \"message_received\"\n      },\n      {\n        \"type\": \"content_match\",\n        \"pattern\": \".*스펙.*|.*어떻게.*|.*언제.*|.*확인.*\"\n      }\n    ],\n    \"operator\": \"AND\"\n  },\n  \"workflow\": {\n    \"description\": \"질문 분석 → JIRA 검색 → Drive 검색 → 답변 작성\",\n    \"steps\": [\n      {\n        \"order\": 1,\n        \"id\": \"step_analyze_question\",\n        \"action\": \"extract_keywords\",\n        \"app\": \"Slack\",\n        \"description\": \"질문에서 검색 키워드 추출\",\n        \"output\": \"search_keywords\"\n      },\n      {\n        \"order\": 2,\n        \"id\": \"step_search_jira\",\n        \"action\": \"search\",\n        \"app\": \"JIRA\",\n        \"description\": \"JIRA에서 관련 티켓 검색\",\n        \"input\": \"search_keywords\",\n        \"output\": \"jira_results\"\n      },\n      {\n        \"order\": 3,\n        \"id\": \"step_read_jira\",\n        \"action\": \"read_content\",\n        \"app\": \"JIRA\",\n        \"description\": \"검색된 티켓 내용 확인\",\n        \"input\": \"jira_results\",\n        \"output\": \"jira_info\"\n      },\n      {\n        \"order\": 4,\n        \"id\": \"step_search_drive\",\n        \"action\": \"search\",\n        \"app\": \"Google Drive\",\n        \"description\": \"Google Drive에서 관련 문서 검색\",\n        \"input\": \"search_keywords\",\n        \"output\": \"drive_results\",\n        \"condition\": \"question_type == 'spec'\"\n      },\n      {\n        \"order\": 5,\n        \"id\": \"step_read_drive\",\n        \"action\": \"read_content\",\n        \"app\": \"Google Drive\",\n        \"description\": \"검색된 문서에서 관련 내용 추출\",\n        \"input\": \"drive_results\",\n        \"output\": \"drive_info\",\n        \"condition\": \"drive_results.length > 0\"\n      },\n      {\n        \"order\": 6,\n        \"id\": \"step_compose_reply\",\n        \"action\": \"compose_text\",\n        \"app\": \"Slack\",\n        \"description\": \"검색 결과를 바탕으로 답변 작성\",\n        \"input\": [\n          \"jira_info\",\n          \"drive_info\"\n        ],\n        \"output\": \"reply_text\"\n      },\n      {\n        \"order\": 7,\n        \"id\": \"step_send_reply\",\n        \"action\": \"send_message\",\n        \"app\": \"Slack\",\n        \"description\": \"답변 전송\",\n        \"input\": \"reply_text\"\n      }\n    ]\n  },\n  \"decisions\": {\n    \"description\": \"검색 범위 및 답변 포맷 기준\",\n    \"rules\": [\n      {\n        \"id\": \"rule_search_scope\",\n        \"condition\": \"question_type == 'spec'\",\n        \"action\": \"search_both_jira_and_drive\",\n        \"description\": \"스펙 관련 질문은 JIRA와 Drive 모두 검색\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_jira_link\",\n        \"condition\": \"jira_results.length > 0\",\n        \"action\": \"include_jira_link\",\n        \"description\": \"관련 티켓이 있으면 JIRA 링크 포함\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_drive_link\",\n        \"condition\": \"question_type == 'spec' && drive_results.length > 0\",\n        \"action\": \"include_drive_link\",\n        \"description\": \"스펙 질문이고 문서가 있으면 Drive 링크 포함\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_keyword_extraction\",\n        \"condition\": \"always\",\n        \"action\": \"extract_feature_and_action\",\n        \"description\": \"기능명 + 상태/동작 조합으로 검색어 생성\",\n        \"source\": \"user_confirmed\"\n      }\n    ]\n  },\n  \"boundaries\": {\n    \"always_do\": [\n      {\n        \"id\": \"always_summarize\",\n        \"description\": \"링크만 보내지 않고 핵심 내용 요약 포함\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"always_jira_link\",\n        \"description\": \"관련 JIRA 티켓 링크 포함\",\n        \"source\": \"user_confirmed\"\n      }\n    ],\n    \"ask_first\": [\n      {\n        \"id\": \"ask_no_results\",\n        \"condition\": \"jira_results.length == 0 && drive_results.length == 0\",\n        \"description\": \"검색 결과가 없으면 PM에게 확인\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"ask_multiple_matches\",\n        \"condition\": \"jira_results.length > 3\",\n        \"description\": \"관련 티켓이 3개 초과면 어떤 것이 맞는지 확인\",\n        \"source\": \"inferred\"\n      }\n    ],\n    \"never_do\": [\n      {\n        \"id\": \"never_guess\",\n        \"description\": \"검색 결과 없이 추측으로 답변하지 않음\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"never_outdated\",\n        \"description\": \"6개월 이상 된 문서는 최신 여부 확인 없이 인용하지 않음\",\n        \"source\": \"inferred\"\n      }\n    ]\n  },\n  \"quality\": {\n    \"description\": \"답변 품질 기준\",\n    \"required_fields\": [\n      {\n        \"field\": \"summary\",\n        \"description\": \"핵심 내용 요약 (2-3문장)\"\n      },\n      {\n        \"field\": \"jira_link\",\n        \"description\": \"JIRA 티켓 링크\"\n      },\n      {\n        \"field\": \"drive_link\",\n        \"description\": \"Drive 문서 링크 (스펙 질문 시)\",\n        \"conditional\": true\n      }\n    ],\n    \"format\": {\n      \"tone\": \"professional_friendly\",\n      \"max_length\": \"300자\",\n      \"structure\": [\n        \"요약\",\n        \"상세 링크\",\n        \"추가 질문 유도\"\n      ]\n    }\n  },\n  \"exceptions\": [\n    {\n      \"id\": \"exc_urgent\",\n      \"condition\": \"message contains '긴급' or '장애'\",\n      \"action\": \"notify_pm_immediately\",\n      \"description\": \"긴급/장애 문의는 자동 답변 없이 PM에게 즉시 알림\",\n      \"source\": \"inferred\"\n    },\n    {\n      \"id\": \"exc_confidential\",\n      \"condition\": \"document marked as 'confidential'\",\n      \"action\": \"ask_pm_before_sharing\",\n      \"description\": \"기밀 문서는 공유 전 PM 확인\",\n      \"source\": \"inferred\"\n    }\n  ],\n  \"tools\": [\n    {\n      \"type\": \"app\",\n      \"name\": \"Slack\",\n      \"required\": true,\n      \"permissions\": [\n        \"read_messages\",\n        \"send_messages\"\n      ]\n    },\n    {\n      \"type\": \"service\",\n      \"name\": \"JIRA\",\n      \"required\": true,\n      \"permissions\": [\n        \"search\",\n        \"read_issues\"\n      ]\n    },\n    {\n      \"type\": \"service\",\n      \"name\": \"Google Drive\",\n      \"required\": true,\n      \"permissions\": [\n        \"search\",\n        \"read_files\"\n      ]\n    }\n  ]\n}"
    },
    "metadata": {
      "questionId": "scenario-01-pm-slack-response",
      "status": "completed"
    }
  },
  {
    "id": "2",
    "title": "시나리오 2: CS 담당자의 고객 문의 처리 자동화",
    "createdAt": "2026-01-31T21:17:32.635Z",
    "pattern": {
      "nodes": [
        {
          "id": "step_read_ticket",
          "type": "input",
          "data": {
            "label": "Zendesk: 티켓 내용 및 고객 정보 확인"
          },
          "position": {
            "x": 0,
            "y": 0
          }
        },
        {
          "id": "step_analyze",
          "type": "default",
          "data": {
            "label": "문의 유형, 고객 감정, 긴급도 분석"
          },
          "position": {
            "x": 0,
            "y": 100
          }
        },
        {
          "id": "step_check_escalation",
          "type": "default",
          "data": {
            "label": "에스컬레이션 필요 여부 판단"
          },
          "position": {
            "x": 0,
            "y": 200
          }
        },
        {
          "id": "step_search_notion",
          "type": "default",
          "data": {
            "label": "Notion: 헬프센터에서 관련 문서 검색"
          },
          "position": {
            "x": 0,
            "y": 300
          }
        },
        {
          "id": "step_read_notion",
          "type": "default",
          "data": {
            "label": "Notion: 검색된 문서에서 해결 방법 추출"
          },
          "position": {
            "x": 0,
            "y": 400
          }
        },
        {
          "id": "step_ask_slack",
          "type": "default",
          "data": {
            "label": "Slack: 개발팀에 기술적 확인 요청"
          },
          "position": {
            "x": 0,
            "y": 500
          }
        },
        {
          "id": "step_compose_reply",
          "type": "default",
          "data": {
            "label": "Zendesk: 답변 초안 작성"
          },
          "position": {
            "x": 0,
            "y": 600
          }
        },
        {
          "id": "step_categorize",
          "type": "default",
          "data": {
            "label": "Zendesk: 티켓 카테고리 및 태그 지정"
          },
          "position": {
            "x": 0,
            "y": 700
          }
        },
        {
          "id": "step_escalate",
          "type": "output",
          "data": {
            "label": "Zendesk: 팀장에게 에스컬레이션"
          },
          "position": {
            "x": 0,
            "y": 800
          }
        }
      ],
      "edges": [
        {
          "id": "e0-1",
          "source": "step_read_ticket",
          "target": "step_analyze",
          "animated": true
        },
        {
          "id": "e1-2",
          "source": "step_analyze",
          "target": "step_check_escalation",
          "animated": true
        },
        {
          "id": "e2-3",
          "source": "step_check_escalation",
          "target": "step_search_notion",
          "animated": true
        },
        {
          "id": "e3-4",
          "source": "step_search_notion",
          "target": "step_read_notion",
          "animated": true
        },
        {
          "id": "e4-5",
          "source": "step_read_notion",
          "target": "step_ask_slack",
          "animated": true
        },
        {
          "id": "e5-6",
          "source": "step_ask_slack",
          "target": "step_compose_reply",
          "animated": true
        },
        {
          "id": "e6-7",
          "source": "step_compose_reply",
          "target": "step_categorize",
          "animated": true
        },
        {
          "id": "e7-8",
          "source": "step_categorize",
          "target": "step_escalate",
          "animated": true
        }
      ]
    },
    "markdown": "# 시나리오 2: CS 담당자의 고객 문의 처리 자동화\n\n**버전: v2.0**  \n**작성일: 2026-02-01**\n\n---\n\n## 1. 페르소나\n\n### 1.1 기본 정보\n\n| 항목 | 내용 |\n|------|------|\n| **역할** | CS (Customer Success) 담당자 |\n| **회사 규모** | 50-200명 스타트업/중소기업 |\n| **업무 경력** | 1-3년차 |\n| **팀 구성** | CS팀 3-5명, 개발팀/운영팀과 협업 |\n\n### 1.2 업무 컨텍스트\n\n| 항목 | 내용 |\n|------|------|\n| **주요 업무** | 고객 문의 분류, 답변, 에스컬레이션 판단 |\n| **일일 처리량** | 30-50건의 티켓 |\n| **문의 유형** | 사용법 40%, 환불/결제 25%, 버그 신고 20%, 기타 15% |\n| **사용 도구** | Zendesk, Notion (헬프센터), Slack |\n\n### 1.3 Pain Points\n\n1. **반복 답변**: 문의의 50%가 FAQ나 헬프센터에 이미 있는 내용\n2. **에스컬레이션 기준 모호**: \"이건 내가 처리해도 되나?\" 매번 고민\n3. **개발팀 문의 지연**: Slack으로 물어봐야 하는데 답변이 늦음\n4. **톤 조절 어려움**: 화난 고객 vs 일반 문의 대응 기준이 암묵적\n\n### 1.4 왜 AI가 필요한가\n\n| 요소 | 설명 |\n|------|------|\n| **자연어 이해** | \"환불해주세요\" vs \"이거 왜 안돼요\" vs \"사기 아니에요?\" 구분 |\n| **감정 분석** | 고객의 감정 상태 파악 → 톤 조절 |\n| **다중 소스 통합** | Zendesk 티켓 + Notion 문서 + Slack 팀 답변 종합 |\n| **암묵적 규칙** | \"제품 불량 환불은 금액 상관없이 팀장 보고\" 같은 룰 |\n\n---\n\n## 2. 시나리오 흐름\n\n### 2.1 트리거 상황\n\n> Zendesk에 새 티켓이 들어옴:\n> \n> **제목**: 결제했는데 구독이 안 돼요!!!\n> **내용**: \"어제 연간 구독 결제했는데 아직도 무료 버전이에요. 돈만 빠져나가고 사기 아닌가요?? 빨리 해결해주세요\"\n> **고객 정보**: 3회 문의 이력, VIP 아님\n\n### 2.2 현재 CS 담당자의 행동 패턴 (Shadow가 관찰)\n\n```\n1. Zendesk에서 새 티켓 열기 (5초)\n2. 티켓 내용 읽기 - 감정 상태 파악 (15초)\n   → \"화난 고객이네, 사과로 시작해야겠다\"\n3. Notion 헬프센터로 이동, \"구독 결제\" 검색 (20초)\n4. \"결제 후 구독 미반영\" 문서 찾아서 확인 (30초)\n   → \"보통 24시간 내 반영인데, 수동 처리가 필요할 수도\"\n5. Slack #cs-dev 채널로 이동 (10초)\n6. 개발팀에 확인 요청 메시지 작성 (40초)\n   → \"티켓 #4521 고객, 어제 결제했는데 구독 미반영. 수동 처리 필요한가요?\"\n7. (개발팀 응답 대기 - 10분)\n8. 응답 확인: \"DB 확인해보니 결제는 됐는데 구독 플래그가 안 바뀌었네요. 수동으로 바꿔드렸습니다\"\n9. Zendesk로 돌아와 답변 작성 (60초)\n   → 사과 문구 + 해결 완료 + 보상 제안\n10. 티켓 카테고리/태그 지정 (10초)\n```\n\n**총 소요 시간: 약 13분 (대기 시간 포함)**\n\n### 2.3 앱 전환 흐름 (3개 앱)\n\n```\n[Zendesk] ──티켓 확인──→ [Notion] ──문서 검색──→ [Slack] ──팀 문의──→ [Zendesk]\n    │                       │                      │                    │\n    │                       │                      │                    │\n    ▼                       ▼                      ▼                    ▼\n 티켓 읽기              헬프센터 검색           개발팀 확인           답변 작성\n 감정 파악              해결 방법 찾기          기술적 확인           톤 조절\n 분류 판단              정책 확인               상태 확인             태그 지정\n```\n\n---\n\n## 3. Shadow 데이터 흐름\n\n### 3.1 OBSERVE (관찰)\n\n**수집 이벤트 시퀀스:**\n\n| 순서 | 앱 | 행동 | 캡처 데이터 |\n|------|-----|------|------------|\n| 1 | Zendesk | 티켓 클릭 | 티켓 내용, 고객 정보 |\n| 2 | Zendesk | 스크롤 (내용 읽기) | 체류 시간: 15초 |\n| 3 | Chrome | Notion 탭 클릭 | 앱 전환 |\n| 4 | Notion | 검색창 클릭 + 타이핑 | 검색어: \"구독 결제\" |\n| 5 | Notion | 문서 클릭 | 문서명: \"결제 후 구독 미반영 대응 가이드\" |\n| 6 | Notion | 스크롤 + 텍스트 선택 | 선택 영역: \"수동 처리 요청 방법\" |\n| 7 | Slack | #cs-dev 채널 클릭 | 앱 전환 |\n| 8 | Slack | 메시지 입력 | 내용: 티켓 번호 + 증상 + 질문 |\n| 9 | Slack | 메시지 읽기 | 개발팀 응답 확인 |\n| 10 | Zendesk | 답변 입력창 클릭 | 앱 전환 |\n| 11 | Zendesk | 답변 타이핑 | 사과 + 해결 + 보상 |\n| 12 | Zendesk | 카테고리 선택 | \"결제/구독\" |\n| 13 | Zendesk | 전송 버튼 클릭 | 답변 완료 |\n\n### 3.2 ANALYZE (분석)\n\n**행동 라벨링 (VLM + LLM):**\n\n```json\n{\n  \"id\": \"action_cs_001\",\n  \"observation_id\": \"obs_cs_001\",\n  \"action_type\": \"read\",\n  \"target_element\": \"ticket_content\",\n  \"app\": \"Zendesk\",\n  \"semantic_label\": \"티켓 내용 확인 - 결제 완료 but 구독 미반영 문의\",\n  \"extracted_info\": {\n    \"issue_type\": \"payment_subscription_mismatch\",\n    \"customer_sentiment\": \"angry\",\n    \"urgency\": \"high\",\n    \"keywords\": [\"결제\", \"구독\", \"미반영\", \"사기\"]\n  }\n}\n```\n\n**패턴 감지 (3회 관찰 후):**\n\n```json\n{\n  \"id\": \"pattern_cs_001\",\n  \"name\": \"고객 문의 처리: Zendesk → Notion → Slack → Zendesk\",\n  \"observation_count\": 3,\n  \"core_sequence\": [\n    {\"order\": 1, \"action\": \"read_ticket\", \"app\": \"Zendesk\", \"output\": \"ticket_info\"},\n    {\"order\": 2, \"action\": \"analyze_sentiment\", \"app\": \"Zendesk\", \"output\": \"customer_sentiment\"},\n    {\"order\": 3, \"action\": \"search\", \"app\": \"Notion\", \"input\": \"issue_keywords\"},\n    {\"order\": 4, \"action\": \"read_document\", \"app\": \"Notion\", \"output\": \"solution_info\"},\n    {\"order\": 5, \"action\": \"send_message\", \"app\": \"Slack\", \"condition\": \"needs_dev_confirmation\"},\n    {\"order\": 6, \"action\": \"read_response\", \"app\": \"Slack\", \"output\": \"dev_response\"},\n    {\"order\": 7, \"action\": \"compose_reply\", \"app\": \"Zendesk\", \"input\": [\"solution_info\", \"dev_response\"]},\n    {\"order\": 8, \"action\": \"categorize\", \"app\": \"Zendesk\"}\n  ],\n  \"uncertainties\": [\n    {\n      \"type\": \"condition\",\n      \"step\": 5,\n      \"description\": \"언제 Slack으로 개발팀에 문의하는가?\",\n      \"hypothesis\": \"기술적 확인이 필요하거나 수동 처리가 필요할 때\"\n    },\n    {\n      \"type\": \"quality\",\n      \"step\": 7,\n      \"description\": \"화난 고객에게 어떻게 답변하는가?\",\n      \"hypothesis\": \"사과 문구로 시작하고 보상 제안\"\n    },\n    {\n      \"type\": \"condition\",\n      \"description\": \"에스컬레이션 기준은?\",\n      \"hypothesis\": \"환불 금액 10만원 이상 또는 법적 언급 시\"\n    }\n  ]\n}\n```\n\n### 3.3 CLARIFY (HITL 질문)\n\n**질문 1 - Slack 문의 조건:**\n\n```json\n{\n  \"id\": \"question_cs_001\",\n  \"type\": \"hypothesis\",\n  \"question_text\": \"기술적 확인이 필요하거나 수동 처리가 필요할 때 Slack으로 개발팀에 문의하시는 것 같은데, 맞나요?\",\n  \"context\": \"최근 10건의 티켓 중 4건에서 Slack으로 개발팀에 문의했습니다. 4건 모두 '시스템 오류', '수동 처리', 'DB 확인' 관련이었습니다.\",\n  \"options\": [\n    {\"id\": \"opt_1\", \"label\": \"네, 기술적 확인이나 수동 처리가 필요할 때 문의합니다\", \"action\": \"add_rule\"},\n    {\"id\": \"opt_2\", \"label\": \"Notion에서 해결 방법을 못 찾았을 때 문의합니다\", \"action\": \"update_rule\"},\n    {\"id\": \"opt_3\", \"label\": \"결제/구독 관련 문의는 항상 개발팀에 확인합니다\", \"action\": \"add_condition\"}\n  ]\n}\n```\n\n**질문 2 - 감정 대응:**\n\n```json\n{\n  \"id\": \"question_cs_002\",\n  \"type\": \"quality\",\n  \"question_text\": \"고객이 화났을 때(욕설, 느낌표 다수, '사기' 등 표현) 답변을 사과 문구로 시작하시는 것 같은데, 맞나요?\",\n  \"context\": \"최근 화난 고객 티켓 5건 중 5건 모두 '불편을 드려 죄송합니다'로 시작했습니다.\",\n  \"options\": [\n    {\"id\": \"opt_1\", \"label\": \"네, 화난 고객에게는 항상 사과로 시작합니다\", \"action\": \"add_rule\"},\n    {\"id\": \"opt_2\", \"label\": \"회사 잘못이 명확할 때만 사과합니다\", \"action\": \"add_condition\"},\n    {\"id\": \"opt_3\", \"label\": \"사과보다는 공감 표현('불편하셨겠네요')으로 시작합니다\", \"action\": \"update_rule\"}\n  ]\n}\n```\n\n**질문 3 - 에스컬레이션:**\n\n```json\n{\n  \"id\": \"question_cs_003\",\n  \"type\": \"hypothesis\",\n  \"question_text\": \"환불 요청 중 '제품 불량'이 사유인 경우 금액과 상관없이 팀장님께 보고하시는 것 같은데, 맞나요?\",\n  \"context\": \"최근 환불 요청 7건 중, 제품 불량 2건은 금액(3만원, 8만원)과 상관없이 팀장님께 공유했고, 단순 변심 5건 중 10만원 이상 1건만 공유했습니다.\",\n  \"options\": [\n    {\"id\": \"opt_1\", \"label\": \"네, 제품 불량은 금액 상관없이 보고합니다\", \"action\": \"add_rule\"},\n    {\"id\": \"opt_2\", \"label\": \"제품 불량 + 금액 5만원 이상일 때 보고합니다\", \"action\": \"add_condition\"},\n    {\"id\": \"opt_3\", \"label\": \"제품 불량이면 보고하고, 그 외에는 10만원 이상일 때 보고합니다\", \"action\": \"add_rule\"}\n  ]\n}\n```\n\n### 3.4 PROCESS (응답 처리)\n\n**사용자 응답:**\n\n질문 1에 opt_1 선택, 질문 3에 opt_3 선택\n\n```json\n{\n  \"id\": \"answer_cs_003\",\n  \"question_id\": \"question_cs_003\",\n  \"selected_option_id\": \"opt_3\",\n  \"timestamp\": \"2026-02-01T16:00:00Z\"\n}\n```\n\n**명세서 업데이트:**\n\n```json\n{\n  \"spec_update\": {\n    \"path\": \"decisions.rules\",\n    \"operation\": \"add\",\n    \"value\": {\n      \"id\": \"rule_escalation\",\n      \"conditions\": [\n        {\"if\": \"refund_reason == 'product_defect'\", \"then\": \"escalate\"},\n        {\"if\": \"refund_reason != 'product_defect' && amount >= 100000\", \"then\": \"escalate\"},\n        {\"else\": \"handle_directly\"}\n      ],\n      \"description\": \"제품 불량은 항상 에스컬레이션, 그 외에는 10만원 이상만\",\n      \"source\": \"user_confirmed\"\n    }\n  }\n}\n```\n\n---\n\n## 4. 생성되는 에이전트 명세서\n\n```json\n{\n  \"meta\": {\n    \"id\": \"spec_cs_001\",\n    \"name\": \"고객 문의 처리 자동화\",\n    \"description\": \"Zendesk 티켓 분류, Notion 검색, Slack 팀 문의, 답변 생성\",\n    \"version\": \"1.2.0\",\n    \"status\": \"active\"\n  },\n\n  \"trigger\": {\n    \"description\": \"Zendesk에 새 티켓이 할당되었을 때\",\n    \"conditions\": [\n      {\"type\": \"app_event\", \"app\": \"Zendesk\", \"event\": \"ticket_assigned\"}\n    ]\n  },\n\n  \"workflow\": {\n    \"description\": \"티켓 분석 → Notion 검색 → Slack 문의 → 답변 작성\",\n    \"steps\": [\n      {\n        \"order\": 1,\n        \"id\": \"step_read_ticket\",\n        \"action\": \"read_content\",\n        \"app\": \"Zendesk\",\n        \"description\": \"티켓 내용 및 고객 정보 확인\",\n        \"output\": \"ticket_info\"\n      },\n      {\n        \"order\": 2,\n        \"id\": \"step_analyze\",\n        \"action\": \"analyze\",\n        \"description\": \"문의 유형, 고객 감정, 긴급도 분석\",\n        \"input\": \"ticket_info\",\n        \"output\": \"analysis_result\"\n      },\n      {\n        \"order\": 3,\n        \"id\": \"step_check_escalation\",\n        \"action\": \"evaluate_rules\",\n        \"description\": \"에스컬레이션 필요 여부 판단\",\n        \"input\": \"analysis_result\",\n        \"output\": \"escalation_decision\"\n      },\n      {\n        \"order\": 4,\n        \"id\": \"step_search_notion\",\n        \"action\": \"search\",\n        \"app\": \"Notion\",\n        \"description\": \"헬프센터에서 관련 문서 검색\",\n        \"input\": \"analysis_result.keywords\",\n        \"output\": \"notion_results\"\n      },\n      {\n        \"order\": 5,\n        \"id\": \"step_read_notion\",\n        \"action\": \"read_content\",\n        \"app\": \"Notion\",\n        \"description\": \"검색된 문서에서 해결 방법 추출\",\n        \"input\": \"notion_results\",\n        \"output\": \"solution_info\"\n      },\n      {\n        \"order\": 6,\n        \"id\": \"step_ask_slack\",\n        \"action\": \"send_message\",\n        \"app\": \"Slack\",\n        \"channel\": \"#cs-dev\",\n        \"description\": \"개발팀에 기술적 확인 요청\",\n        \"input\": \"ticket_info\",\n        \"output\": \"dev_response\",\n        \"condition\": \"needs_technical_confirmation || needs_manual_action\",\n        \"is_variable\": true\n      },\n      {\n        \"order\": 7,\n        \"id\": \"step_compose_reply\",\n        \"action\": \"compose_text\",\n        \"app\": \"Zendesk\",\n        \"description\": \"답변 초안 작성\",\n        \"input\": [\"ticket_info\", \"solution_info\", \"dev_response\", \"analysis_result.sentiment\"],\n        \"output\": \"reply_draft\"\n      },\n      {\n        \"order\": 8,\n        \"id\": \"step_categorize\",\n        \"action\": \"set_field\",\n        \"app\": \"Zendesk\",\n        \"description\": \"티켓 카테고리 및 태그 지정\",\n        \"input\": \"analysis_result.category\"\n      },\n      {\n        \"order\": 9,\n        \"id\": \"step_escalate\",\n        \"action\": \"escalate\",\n        \"app\": \"Zendesk\",\n        \"description\": \"팀장에게 에스컬레이션\",\n        \"condition\": \"escalation_decision == true\",\n        \"is_variable\": true\n      }\n    ]\n  },\n\n  \"decisions\": {\n    \"description\": \"분류, 에스컬레이션, 톤 조절 기준\",\n    \"rules\": [\n      {\n        \"id\": \"rule_slack_inquiry\",\n        \"condition\": \"needs_technical_confirmation || needs_manual_action\",\n        \"action\": \"ask_dev_team_via_slack\",\n        \"description\": \"기술적 확인이나 수동 처리 필요 시 Slack으로 개발팀 문의\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_tone_angry\",\n        \"condition\": \"customer_sentiment == 'angry'\",\n        \"action\": \"start_with_apology\",\n        \"description\": \"화난 고객에게는 사과 문구로 시작\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_escalation\",\n        \"conditions\": [\n          {\"if\": \"refund_reason == 'product_defect'\", \"then\": \"escalate\"},\n          {\"if\": \"refund_reason != 'product_defect' && amount >= 100000\", \"then\": \"escalate\"}\n        ],\n        \"description\": \"제품 불량은 항상 에스컬레이션, 그 외에는 10만원 이상만\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_vip\",\n        \"condition\": \"customer_type == 'vip'\",\n        \"action\": \"prioritize_and_personalize\",\n        \"description\": \"VIP 고객은 우선 처리 + 개인화된 톤\",\n        \"source\": \"inferred\"\n      }\n    ]\n  },\n\n  \"boundaries\": {\n    \"always_do\": [\n      {\n        \"id\": \"always_acknowledge\",\n        \"description\": \"문의 내용을 먼저 확인했음을 언급\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"always_next_step\",\n        \"description\": \"답변 끝에 추가 문의 안내 포함\",\n        \"source\": \"inferred\"\n      },\n      {\n        \"id\": \"always_tag\",\n        \"description\": \"티켓에 적절한 카테고리/태그 지정\",\n        \"source\": \"user_confirmed\"\n      }\n    ],\n    \"ask_first\": [\n      {\n        \"id\": \"ask_policy_exception\",\n        \"condition\": \"customer_requests_exception_to_policy\",\n        \"description\": \"정책 예외 요청은 팀장 확인 필요\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"ask_compensation\",\n        \"condition\": \"compensation_value > 10000\",\n        \"description\": \"1만원 초과 보상은 승인 필요\",\n        \"source\": \"user_confirmed\"\n      }\n    ],\n    \"never_do\": [\n      {\n        \"id\": \"never_promise_timeline\",\n        \"description\": \"확인되지 않은 처리 일정 약속 금지\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"never_blame_customer\",\n        \"description\": \"고객 탓하는 표현 금지\",\n        \"source\": \"inferred\"\n      },\n      {\n        \"id\": \"never_share_internal\",\n        \"description\": \"내부 시스템/정책 상세 공유 금지\",\n        \"source\": \"inferred\"\n      }\n    ]\n  },\n\n  \"quality\": {\n    \"description\": \"답변 품질 기준\",\n    \"required_fields\": [\n      {\"field\": \"greeting\", \"description\": \"인사말\"},\n      {\"field\": \"acknowledgment\", \"description\": \"문의 내용 확인\"},\n      {\"field\": \"solution\", \"description\": \"해결 방법 또는 현재 상태\"},\n      {\"field\": \"next_step\", \"description\": \"다음 단계 안내\"}\n    ],\n    \"tone_rules\": [\n      {\n        \"condition\": \"customer_sentiment == 'angry'\",\n        \"tone\": \"empathetic_apologetic\",\n        \"example_start\": \"먼저 불편을 드려 진심으로 죄송합니다.\"\n      },\n      {\n        \"condition\": \"customer_sentiment == 'neutral'\",\n        \"tone\": \"friendly_professional\",\n        \"example_start\": \"안녕하세요, 문의 주셔서 감사합니다.\"\n      },\n      {\n        \"condition\": \"customer_type == 'vip'\",\n        \"tone\": \"premium_personalized\",\n        \"example_start\": \"[고객명]님, 항상 이용해 주셔서 감사합니다.\"\n      }\n    ]\n  },\n\n  \"exceptions\": [\n    {\n      \"id\": \"exc_legal_threat\",\n      \"condition\": \"message contains '소송' or '신고' or '법적'\",\n      \"action\": \"escalate_immediately\",\n      \"notify\": \"team_lead\",\n      \"description\": \"법적 위협은 즉시 에스컬레이션\",\n      \"source\": \"inferred\"\n    },\n    {\n      \"id\": \"exc_repeat_customer\",\n      \"condition\": \"customer_ticket_count >= 3 && within_7_days\",\n      \"action\": \"flag_and_notify\",\n      \"description\": \"7일 내 3회 이상 문의 고객은 팀장에게 공유\",\n      \"source\": \"user_confirmed\"\n    },\n    {\n      \"id\": \"exc_system_error\",\n      \"condition\": \"issue_type == 'system_error' && affects_multiple_users\",\n      \"action\": \"escalate_to_dev_lead\",\n      \"description\": \"다수 사용자 영향 시스템 오류는 개발 리드에게 에스컬레이션\",\n      \"source\": \"inferred\"\n    }\n  ],\n\n  \"tools\": [\n    {\"type\": \"service\", \"name\": \"Zendesk\", \"required\": true, \"permissions\": [\"read_tickets\", \"update_tickets\", \"send_replies\"]},\n    {\"type\": \"service\", \"name\": \"Notion\", \"required\": true, \"permissions\": [\"search\", \"read\"]},\n    {\"type\": \"app\", \"name\": \"Slack\", \"required\": true, \"permissions\": [\"send_messages\", \"read_messages\"]}\n  ]\n}\n```\n\n---\n\n## 5. PM 시나리오 vs CS 시나리오 비교\n\n| 항목 | PM (Slack 문의) | CS (고객 문의) |\n|------|----------------|----------------|\n| **입력 복잡도** | 중 (내부 동료 질문) | 고 (외부 고객, 감정 포함) |\n| **판단 포인트** | 검색 범위, 답변 포맷 | 감정 대응, 에스컬레이션, Slack 문의 여부 |\n| **앱 조합** | Slack → JIRA → Drive → Slack | Zendesk → Notion → Slack → Zendesk |\n| **HITL 질문 수** | 3개 | 3-4개 |\n| **암묵적 규칙 예시** | \"스펙 질문은 Drive까지 검색\" | \"제품 불량 환불은 무조건 에스컬레이션\" |\n\n---\n\n## 6. 성공 지표\n\n### 6.1 구조적 완성도 (자동 측정)\n\n| 지표 | 측정 방법 | 목표 |\n|------|----------|------|\n| 필수 필드 완성도 | 모든 섹션 존재 여부 | 100% |\n| 규칙 구체성 | 조건문에 구체적 수치/키워드 포함 | 모든 규칙 |\n| 예외 커버리지 | exceptions 항목 수 | 3개 이상 |\n| 톤 규칙 | quality.tone_rules 정의 여부 | 3개 이상 |\n\n### 6.2 사용자 평가 (주관)\n\n| 지표 | 질문 | 목표 |\n|------|------|------|\n| 정확도 | \"에스컬레이션 기준이 맞아?\" | 5/5 |\n| 톤 적절성 | \"화난 고객 대응 방식이 맞아?\" | 4/5 이상 |\n| 실행 가능성 | \"신입 CS가 이걸 보고 따라할 수 있어?\" | 4/5 이상 |\n\n---\n\n\n",
    "result": {
      "type": "json",
      "content": "{\n  \"meta\": {\n    \"id\": \"spec_cs_001\",\n    \"name\": \"고객 문의 처리 자동화\",\n    \"description\": \"Zendesk 티켓 분류, Notion 검색, Slack 팀 문의, 답변 생성\",\n    \"version\": \"1.2.0\",\n    \"status\": \"active\"\n  },\n  \"trigger\": {\n    \"description\": \"Zendesk에 새 티켓이 할당되었을 때\",\n    \"conditions\": [\n      {\n        \"type\": \"app_event\",\n        \"app\": \"Zendesk\",\n        \"event\": \"ticket_assigned\"\n      }\n    ]\n  },\n  \"workflow\": {\n    \"description\": \"티켓 분석 → Notion 검색 → Slack 문의 → 답변 작성\",\n    \"steps\": [\n      {\n        \"order\": 1,\n        \"id\": \"step_read_ticket\",\n        \"action\": \"read_content\",\n        \"app\": \"Zendesk\",\n        \"description\": \"티켓 내용 및 고객 정보 확인\",\n        \"output\": \"ticket_info\"\n      },\n      {\n        \"order\": 2,\n        \"id\": \"step_analyze\",\n        \"action\": \"analyze\",\n        \"description\": \"문의 유형, 고객 감정, 긴급도 분석\",\n        \"input\": \"ticket_info\",\n        \"output\": \"analysis_result\"\n      },\n      {\n        \"order\": 3,\n        \"id\": \"step_check_escalation\",\n        \"action\": \"evaluate_rules\",\n        \"description\": \"에스컬레이션 필요 여부 판단\",\n        \"input\": \"analysis_result\",\n        \"output\": \"escalation_decision\"\n      },\n      {\n        \"order\": 4,\n        \"id\": \"step_search_notion\",\n        \"action\": \"search\",\n        \"app\": \"Notion\",\n        \"description\": \"헬프센터에서 관련 문서 검색\",\n        \"input\": \"analysis_result.keywords\",\n        \"output\": \"notion_results\"\n      },\n      {\n        \"order\": 5,\n        \"id\": \"step_read_notion\",\n        \"action\": \"read_content\",\n        \"app\": \"Notion\",\n        \"description\": \"검색된 문서에서 해결 방법 추출\",\n        \"input\": \"notion_results\",\n        \"output\": \"solution_info\"\n      },\n      {\n        \"order\": 6,\n        \"id\": \"step_ask_slack\",\n        \"action\": \"send_message\",\n        \"app\": \"Slack\",\n        \"channel\": \"#cs-dev\",\n        \"description\": \"개발팀에 기술적 확인 요청\",\n        \"input\": \"ticket_info\",\n        \"output\": \"dev_response\",\n        \"condition\": \"needs_technical_confirmation || needs_manual_action\",\n        \"is_variable\": true\n      },\n      {\n        \"order\": 7,\n        \"id\": \"step_compose_reply\",\n        \"action\": \"compose_text\",\n        \"app\": \"Zendesk\",\n        \"description\": \"답변 초안 작성\",\n        \"input\": [\n          \"ticket_info\",\n          \"solution_info\",\n          \"dev_response\",\n          \"analysis_result.sentiment\"\n        ],\n        \"output\": \"reply_draft\"\n      },\n      {\n        \"order\": 8,\n        \"id\": \"step_categorize\",\n        \"action\": \"set_field\",\n        \"app\": \"Zendesk\",\n        \"description\": \"티켓 카테고리 및 태그 지정\",\n        \"input\": \"analysis_result.category\"\n      },\n      {\n        \"order\": 9,\n        \"id\": \"step_escalate\",\n        \"action\": \"escalate\",\n        \"app\": \"Zendesk\",\n        \"description\": \"팀장에게 에스컬레이션\",\n        \"condition\": \"escalation_decision == true\",\n        \"is_variable\": true\n      }\n    ]\n  },\n  \"decisions\": {\n    \"description\": \"분류, 에스컬레이션, 톤 조절 기준\",\n    \"rules\": [\n      {\n        \"id\": \"rule_slack_inquiry\",\n        \"condition\": \"needs_technical_confirmation || needs_manual_action\",\n        \"action\": \"ask_dev_team_via_slack\",\n        \"description\": \"기술적 확인이나 수동 처리 필요 시 Slack으로 개발팀 문의\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_tone_angry\",\n        \"condition\": \"customer_sentiment == 'angry'\",\n        \"action\": \"start_with_apology\",\n        \"description\": \"화난 고객에게는 사과 문구로 시작\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_escalation\",\n        \"conditions\": [\n          {\n            \"if\": \"refund_reason == 'product_defect'\",\n            \"then\": \"escalate\"\n          },\n          {\n            \"if\": \"refund_reason != 'product_defect' && amount >= 100000\",\n            \"then\": \"escalate\"\n          }\n        ],\n        \"description\": \"제품 불량은 항상 에스컬레이션, 그 외에는 10만원 이상만\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"rule_vip\",\n        \"condition\": \"customer_type == 'vip'\",\n        \"action\": \"prioritize_and_personalize\",\n        \"description\": \"VIP 고객은 우선 처리 + 개인화된 톤\",\n        \"source\": \"inferred\"\n      }\n    ]\n  },\n  \"boundaries\": {\n    \"always_do\": [\n      {\n        \"id\": \"always_acknowledge\",\n        \"description\": \"문의 내용을 먼저 확인했음을 언급\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"always_next_step\",\n        \"description\": \"답변 끝에 추가 문의 안내 포함\",\n        \"source\": \"inferred\"\n      },\n      {\n        \"id\": \"always_tag\",\n        \"description\": \"티켓에 적절한 카테고리/태그 지정\",\n        \"source\": \"user_confirmed\"\n      }\n    ],\n    \"ask_first\": [\n      {\n        \"id\": \"ask_policy_exception\",\n        \"condition\": \"customer_requests_exception_to_policy\",\n        \"description\": \"정책 예외 요청은 팀장 확인 필요\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"ask_compensation\",\n        \"condition\": \"compensation_value > 10000\",\n        \"description\": \"1만원 초과 보상은 승인 필요\",\n        \"source\": \"user_confirmed\"\n      }\n    ],\n    \"never_do\": [\n      {\n        \"id\": \"never_promise_timeline\",\n        \"description\": \"확인되지 않은 처리 일정 약속 금지\",\n        \"source\": \"user_confirmed\"\n      },\n      {\n        \"id\": \"never_blame_customer\",\n        \"description\": \"고객 탓하는 표현 금지\",\n        \"source\": \"inferred\"\n      },\n      {\n        \"id\": \"never_share_internal\",\n        \"description\": \"내부 시스템/정책 상세 공유 금지\",\n        \"source\": \"inferred\"\n      }\n    ]\n  },\n  \"quality\": {\n    \"description\": \"답변 품질 기준\",\n    \"required_fields\": [\n      {\n        \"field\": \"greeting\",\n        \"description\": \"인사말\"\n      },\n      {\n        \"field\": \"acknowledgment\",\n        \"description\": \"문의 내용 확인\"\n      },\n      {\n        \"field\": \"solution\",\n        \"description\": \"해결 방법 또는 현재 상태\"\n      },\n      {\n        \"field\": \"next_step\",\n        \"description\": \"다음 단계 안내\"\n      }\n    ],\n    \"tone_rules\": [\n      {\n        \"condition\": \"customer_sentiment == 'angry'\",\n        \"tone\": \"empathetic_apologetic\",\n        \"example_start\": \"먼저 불편을 드려 진심으로 죄송합니다.\"\n      },\n      {\n        \"condition\": \"customer_sentiment == 'neutral'\",\n        \"tone\": \"friendly_professional\",\n        \"example_start\": \"안녕하세요, 문의 주셔서 감사합니다.\"\n      },\n      {\n        \"condition\": \"customer_type == 'vip'\",\n        \"tone\": \"premium_personalized\",\n        \"example_start\": \"[고객명]님, 항상 이용해 주셔서 감사합니다.\"\n      }\n    ]\n  },\n  \"exceptions\": [\n    {\n      \"id\": \"exc_legal_threat\",\n      \"condition\": \"message contains '소송' or '신고' or '법적'\",\n      \"action\": \"escalate_immediately\",\n      \"notify\": \"team_lead\",\n      \"description\": \"법적 위협은 즉시 에스컬레이션\",\n      \"source\": \"inferred\"\n    },\n    {\n      \"id\": \"exc_repeat_customer\",\n      \"condition\": \"customer_ticket_count >= 3 && within_7_days\",\n      \"action\": \"flag_and_notify\",\n      \"description\": \"7일 내 3회 이상 문의 고객은 팀장에게 공유\",\n      \"source\": \"user_confirmed\"\n    },\n    {\n      \"id\": \"exc_system_error\",\n      \"condition\": \"issue_type == 'system_error' && affects_multiple_users\",\n      \"action\": \"escalate_to_dev_lead\",\n      \"description\": \"다수 사용자 영향 시스템 오류는 개발 리드에게 에스컬레이션\",\n      \"source\": \"inferred\"\n    }\n  ],\n  \"tools\": [\n    {\n      \"type\": \"service\",\n      \"name\": \"Zendesk\",\n      \"required\": true,\n      \"permissions\": [\n        \"read_tickets\",\n        \"update_tickets\",\n        \"send_replies\"\n      ]\n    },\n    {\n      \"type\": \"service\",\n      \"name\": \"Notion\",\n      \"required\": true,\n      \"permissions\": [\n        \"search\",\n        \"read\"\n      ]\n    },\n    {\n      \"type\": \"app\",\n      \"name\": \"Slack\",\n      \"required\": true,\n      \"permissions\": [\n        \"send_messages\",\n        \"read_messages\"\n      ]\n    }\n  ]\n}"
    },
    "metadata": {
      "questionId": "scenario-02-cs-support",
      "status": "completed"
    }
  }
];

export function getOutputById(id: string): Output | undefined {
  return MOCK_OUTPUTS.find((output) => output.id === id);
}
