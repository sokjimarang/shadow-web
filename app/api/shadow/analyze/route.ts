import { NextRequest, NextResponse } from 'next/server';

const SHADOW_PY_URL = process.env.SHADOW_PY_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({ backend: 'claude' }));

    const res = await fetch(`${SHADOW_PY_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: '분석 시작 실패', details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'shadow-py 서버 연결 실패', details: String(error) },
      { status: 500 }
    );
  }
}
