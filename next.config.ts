import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 파일 감시 디바운싱 설정
   *
   * 여러 파일을 빠르게 연속으로 수정할 때 발생하는 문제 방지:
   * - 파일 변경 감지 후 300ms 대기한 뒤 빌드 시작
   * - 여러 HMR 프로세스가 동시에 빌드 매니페스트 파일에 접근하는 경쟁 상태(race condition) 방지
   * - 파일 시스템 ENOENT 에러 감소
   *
   * 트레이드오프: 코드 변경 후 브라우저 반영까지 약 300ms 지연
   */
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      aggregateTimeout: 300, // 300ms 대기 후 빌드
    };
    return config;
  },
};

export default nextConfig;
