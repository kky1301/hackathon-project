# UniStarter

대학 신입생과 1학년 학생을 위한 모바일 우선 올인원 캠퍼스 가이드입니다.

## 완료된 기능

- 카테고리별 학생 혜택 탐색 및 LocalStorage 북마크
- 7단계 신입생 생존 체크리스트와 진행률 표시
- 주요 학사 일정 D-Day 및 사용자 지정 D-Day 계산기
- 혜택·가이드·FAQ 통합 검색과 빈 결과 처리
- 대학교·전공 프로필 설정 및 개인 활동 요약
- 반응형 모바일 하단 내비게이션과 데스크톱 사이드바
- LocalStorage 기반 다크/라이트 테마 영속화
- 저장 실패와 빈 상태에 대한 사용자 안내

## 기능 경로

- `/` — 단일 페이지 앱
  - `home` — 혜택, 통합 검색, FAQ
  - `guide` — 첫 학기 준비 체크리스트
  - `calendar` — 학사 일정 및 D-Day 계산기
  - `saved` — 북마크와 프로필

탭 전환은 클라이언트 상태로 처리되며 별도 URL 파라미터는 사용하지 않습니다.

## 데이터 구조와 저장소

- 혜택, 체크리스트, FAQ, 학사 일정: 앱 내 샘플 데이터
- `unistarter-saved`: 저장한 혜택 ID 배열
- `unistarter-tasks`: 완료한 체크리스트 ID 배열
- `unistarter-profile`: 대학교 및 전공 설정
- `unistarter-theme`: 선택한 테마
- 외부 데이터베이스나 개인정보 서버 전송 없음

## 실행 방법

```bash
npm run build
pm2 start ecosystem.config.cjs
```

로컬 미리보기: `http://localhost:3000`

## 배포

- 대상 플랫폼: Cloudflare Pages
- 기술 스택: Hono, HTML5, Tailwind CSS CDN, Lucide Icons, Vanilla JavaScript
- 상태: 로컬 빌드 및 미리보기 준비 완료

## 아직 구현하지 않은 기능

- 실제 대학 포털/학사 캘린더 API 연동
- 학교별 인증과 개인화된 공지 수집
- 기기 간 북마크 동기화

## 추천 다음 단계

1. 대학별 공식 데이터 소스와 제휴 혜택 검증 체계 추가
2. Cloudflare D1 기반 계정 동기화 도입
3. PWA 설치와 일정 알림 기능 추가

마지막 업데이트: 2026-09-21
