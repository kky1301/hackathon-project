# UniStarter

대학 신입생과 1학년 학생을 위한 모바일 우선 올인원 캠퍼스 가이드입니다.

## 완료된 기능

- 카테고리별 학생 혜택 탐색, 상세 이용 방법, 공식 사이트 연결 및 LocalStorage 북마크
- 7단계 신입생 생존 체크리스트와 진행률 표시
- 국립순천대학교 공식 학사일정 API 프록시 연동 및 D-Day 자동 계산
- 공식 일정 연결 실패 시 캐시·기본 일정 폴백과 수동 새로고침
- 혜택·가이드·FAQ 통합 검색과 빈 결과 처리
- 카카오톡 지갑 톡학생증 발급 방법 및 공식 안내 연결
- 신입생 체크리스트 카드별 단계별 실행 방법과 관련 사이트 연결
- 광주·전남 대학 및 국립순천대학교 공식 전공별 프로필 설정
- 향림통 포털, e-캠퍼스, 도서관, 학사안내 공식 바로가기
- PWA 홈 화면 설치와 오프라인 앱 셸
- 현재 서비스 주소를 자동 반영하는 공유 QR 코드 생성 및 PNG 저장
- 사용자 동의 기반 1일·3일·7일 전 학사일정 알림
- 반응형 모바일 하단 내비게이션과 데스크톱 사이드바
- LocalStorage 기반 다크/라이트 테마 영속화
- 저장 실패와 빈 상태에 대한 사용자 안내

## 기능 경로

- `/` — 단일 페이지 앱
  - `?page=home` — 혜택, 통합 검색, FAQ
  - `?page=guide` — 첫 학기 준비 체크리스트와 단계별 방법 안내
  - `?page=calendar` — 공식 학사 일정, D-Day, 알림 설정
  - `?page=saved` — 북마크, 프로필, 학교 포털 바로가기, 공유 QR
- `/api/scnu/calendar` — 국립순천대학교 공개 학사일정 정규화 API
- `/manifest.webmanifest` — PWA 앱 매니페스트
- `/sw.js` — 오프라인 캐시 및 알림 클릭 처리 서비스 워커

## 데이터 구조와 저장소

- 혜택, 체크리스트, FAQ: 앱 내 샘플 데이터
- 학사 일정: 국립순천대학교 학사안내 공개 JSON 엔드포인트를 Hono API가 정규화
- `unistarter-saved`: 저장한 혜택 ID 배열
- `unistarter-tasks`: 완료한 체크리스트 ID 배열
- `unistarter-profile`: 대학교 및 전공 설정
- `unistarter-theme`: 선택한 테마
- `unistarter-calendar-cache`: 최근 동기화된 공식 일정
- `unistarter-reminder`: 알림 사용 여부, 알림 시점, 마지막 알림 기록
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

- 로그인 필요한 향림통 내부 데이터 조회
- 학교별 인증과 개인화된 공지 수집
- 기기 간 북마크·알림 설정 동기화
- 앱이 완전히 종료된 상태의 서버 푸시 알림

## 추천 다음 단계

1. 다른 광주·전남 대학의 공식 학사일정 어댑터 추가
2. Cloudflare D1 기반 계정 동기화 도입
3. Web Push 구독 기반 백그라운드 알림 추가

마지막 업데이트: 2026-09-21
