# AI News App

개인용 뉴스 큐레이션 웹앱. 로그인하면 국내/해외 RSS 소스에서 기사를 수집하고, Claude API로 번역·요약·카테고리 분류를 거쳐 카드로 보여준다. 결과는 Notion 데이터베이스에도 동기화할 수 있다.

자세한 배경과 요구사항은 [PRD.md](./PRD.md) 참고.

## 기술 스택

- **Next.js (App Router)** — 로그인 화면, 뉴스 목록, 수집 트리거, API 라우트
- **Clerk** — 인증/세션 관리 (단일 사용자)
- **Neon (Postgres) + Drizzle ORM** — 기사 저장소
- **Claude API** — 번역·요약·카테고리 분류
- **Notion REST API** — 결과 동기화
- **Vercel** — 배포

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

### 환경 변수

`.env.local`에 다음 키가 필요하다 (값은 각 서비스 콘솔에서 발급):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
ANTHROPIC_API_KEY=
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

## 명령어

```bash
npm run dev      # 개발 서버 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 빌드 실행
npm run lint     # eslint
```

## 구조

- `src/app/` — 라우트 (App Router)
- `src/components/` — UI 컴포넌트
- `src/db/` — Drizzle 스키마/클라이언트
- `src/lib/` — Claude 분석, Notion 동기화 등 비즈니스 로직
