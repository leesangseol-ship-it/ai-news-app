# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에게 제공되는 가이드입니다.

## 프로젝트 현황

이 저장소는 현재 `create-next-app`으로 만든 기본 스캐폴드와 `PRD.md`만 존재합니다. 인증, 데이터 모델, 수집/번역/요약 파이프라인, Notion 동기화 등 실제 애플리케이션 코드는 아직 구현되지 않았습니다. `PRD.md`가 범위와 목표 아키텍처에 대한 소스 오브 트루스이므로, 기능을 계획하거나 구현하기 전에 먼저 읽어야 합니다.

PRD에서 확정된 기술 스택:
- **Next.js (App Router)** — 로그인 화면, 뉴스 목록 화면, 수집 트리거, API 라우트를 모두 담당하는 풀스택 앱 하나
- **Clerk** — 인증/세션 관리. 단일 사용자만 사용하며 추가 회원가입은 막아야 함. 미들웨어에서 미인증 요청을 로그인 화면으로 리다이렉트
- **Neon (Postgres) + Drizzle ORM** — 기사(원문, 번역, 요약, 카테고리, 출처, 발행일, 언어, 수집일시, Notion 동기화 여부, 마지막 수집 시각)를 저장하는 1차 저장소. URL 기준 중복 판별과 1시간 재수집 제한 판단도 이 DB에서 수행
- **Claude API** — 번역(비한국어 → 한국어), 요약, 카테고리 분류를 기사당 한 번의 호출로 처리
- **Notion REST API (Integration Token)** — 동기화는 Notion MCP가 아니라 이 방식으로 구현. MCP 도구는 어시스턴트(Claude Code) 쪽에서만 쓸 수 있고 배포된 앱이 런타임에 호출할 수 없으므로, 운영 코드는 Notion 공식 REST API를 직접 호출해야 함
- **Vercel** — 배포

미해결 항목은 `PRD.md`의 "결정 필요" 섹션에 정리되어 있습니다 (RSS 소스 목록, Notion DB 필드 스키마, Clerk/Neon/Notion 중 어떤 계정·키가 실제로 발급되어 있는지, 자동 스케줄링 도입 시점). 이 항목들을 전제로 구현하기 전에 사용자에게 먼저 확인하세요.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (Turbopack, localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 빌드 실행
npm run lint     # eslint
```

테스트 러너는 아직 설정되어 있지 않습니다.

## 아키텍처 참고사항

- TypeScript 경로 별칭 `@/*` → `./src/*` (`tsconfig.json`)
- App Router 사용, 소스는 `src/app/` 아래에 위치
- Tailwind CSS v4 (`@tailwindcss/turbopack`), 스타일은 `src/app/globals.css`
- 저장소 루트의 `AGENTS.md`는 `next dev`가 자동으로 재생성하는 파일입니다 (`node_modules/next/dist/server/lib/generate-agent-files.js` 참고) — 직접 관리하는 파일은 아니지만 **반드시 읽어야 합니다**: 이 Next.js 버전(16.x)은 이전 버전과 API/컨벤션이 크게 달라져 학습 데이터와 맞지 않을 수 있습니다. 라우팅, 데이터 페칭, 미들웨어 등 프레임워크 관련 코드를 작성하기 전에 `node_modules/next/dist/docs/`에서 현재 버전 문서를 확인하세요.
