import { NextResponse } from 'next/server';

const SHADOW_PY_URL = process.env.SHADOW_PY_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const res = await fetch(`${SHADOW_PY_URL}/recording/status`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'shadow-py API 호출 실패' },
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
