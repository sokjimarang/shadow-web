#!/bin/bash
# docs 폴더에 파일이 생성/수정될 때 CLAUDE.md의 문서 목록을 자동 업데이트

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# docs 폴더의 .md 파일인지 확인
if [[ ! "$FILE_PATH" =~ ^.*/docs/.*\.md$ ]]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CLAUDE_MD="$PROJECT_DIR/CLAUDE.md"
DOCS_DIR="$PROJECT_DIR/docs"

# CLAUDE.md가 없으면 종료
if [ ! -f "$CLAUDE_MD" ]; then
  exit 0
fi

# "### 문서 목록" 섹션이 없으면 종료 (수동으로 섹션 추가 필요)
if ! grep -q "^### 문서 목록" "$CLAUDE_MD"; then
  echo "CLAUDE.md에 '### 문서 목록' 섹션이 없습니다." >&2
  exit 0
fi

# 임시 파일 생성
TEMP_FILE=$(mktemp)
NEW_SECTION_FILE=$(mktemp)

# 새로운 문서 목록 생성
{
  echo "### 문서 목록"
  echo ""

  # direction
  echo "#### direction (기획)"
  if [ -d "$DOCS_DIR/direction" ]; then
    for file in "$DOCS_DIR/direction"/*.md; do
      [ -f "$file" ] && echo "- \`docs/direction/$(basename "$file")\`"
    done
  fi
  echo ""

  # plan
  echo "#### plan (계획안)"
  if [ -d "$DOCS_DIR/plan" ]; then
    found=0
    for file in "$DOCS_DIR/plan"/*.md; do
      [ -f "$file" ] && echo "- \`docs/plan/$(basename "$file")\`" && found=1
    done
    [ $found -eq 0 ] && echo "- (없음)"
  else
    echo "- (없음)"
  fi
  echo ""

  # report
  echo "#### report (리포트)"
  if [ -d "$DOCS_DIR/report" ]; then
    found=0
    for file in "$DOCS_DIR/report"/*.md; do
      [ -f "$file" ] && echo "- \`docs/report/$(basename "$file")\`" && found=1
    done
    [ $found -eq 0 ] && echo "- (없음)"
  else
    echo "- (없음)"
  fi
  echo ""
} > "$NEW_SECTION_FILE"

# CLAUDE.md에서 기존 "### 문서 목록" ~ 다음 "#" 헤딩 전까지 제거하고 새 내용 삽입
awk '
  /^### 문서 목록/ {
    # 새 섹션 내용 삽입
    while ((getline line < "'"$NEW_SECTION_FILE"'") > 0) print line
    skip = 1
    next
  }
  /^#{1,2} [^#]/ && skip { skip = 0 }
  !skip { print }
' "$CLAUDE_MD" > "$TEMP_FILE"

# 결과 검증 후 적용
if [ -s "$TEMP_FILE" ]; then
  mv "$TEMP_FILE" "$CLAUDE_MD"
  echo "CLAUDE.md 문서 목록이 업데이트되었습니다." >&2
else
  echo "오류: 업데이트 실패 (빈 결과)" >&2
  rm -f "$TEMP_FILE"
fi

rm -f "$NEW_SECTION_FILE"
exit 0
