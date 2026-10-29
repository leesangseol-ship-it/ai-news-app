# UI 가이드 — AI뉴스 수집기

메인 화면은 수집된 뉴스를 카드로 보여주는 대시보드. Tailwind CSS 유틸리티 클래스만 사용(커스텀 CSS 없음), 라이트/다크 모드 둘 다 지원.

## 색상

| 용도 | 라이트 | 다크 |
|---|---|---|
| 페이지 배경 | `bg-slate-50` | `dark:bg-slate-950` |
| 카드/헤더 배경 | `bg-white` | `dark:bg-slate-900` |
| 테두리 | `border-slate-200` | `dark:border-slate-800` |
| 본문 텍스트 | `text-slate-900` / `text-slate-600` | `dark:text-slate-50` / `dark:text-slate-400` |
| 보조 텍스트 | `text-slate-400` | 동일 |
| 브랜드/포인트 | `text-blue-700`, `bg-blue-50 text-blue-700` | `dark:text-blue-400`, `dark:bg-blue-950 dark:text-blue-300` |

포인트 컬러(파란색)는 브랜드 타이틀, 카테고리 뱃지, 링크에만 사용. 그 외는 slate 그레이스케일로 통일해 전체적으로 차분하고 읽기 편한 느낌을 유지한다.

## 레이아웃

- 전체 폭 제한: `mx-auto max-w-6xl` + `px-6`
- 헤더: 흰 배경 + 하단 border, 좌측에 앱 타이틀("AI 뉴스"), 우측에 `UserButton`
- 카테고리 바: 헤더 아래, 메인 영역 상단에 위치. 가로 스크롤 가능한 pill 목록 + 끝에 "＋ 카테고리 추가" 버튼
- 카드 그리드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
- 빈 상태: 중앙 정렬 안내 문구, `text-slate-400`

## 컴포넌트

### 카테고리 바 (`src/components/category-bar.tsx`, 신규)

```
<nav className="flex items-center gap-2 overflow-x-auto pb-4">
  {categories.map(cat => (
    <button className="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium
      border-slate-200 text-slate-600 hover:bg-slate-100
      data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700
      dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
      {cat.name}
    </button>
  ))}
  <button aria-label="카테고리 추가" className="shrink-0 rounded-full border border-dashed
    border-slate-300 px-3.5 py-1.5 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-600
    dark:border-slate-700 dark:text-slate-500">
    ＋ 카테고리 추가
  </button>
</nav>
```

- 선택된 카테고리는 파란색 강조(테두리+배경+텍스트), 나머지는 중립 회색
- 추가 버튼은 점선 테두리로 시각적으로 구분(목록 항목이 아님을 표시)
- 가로 스크롤은 `overflow-x-auto` + 각 버튼 `shrink-0`으로 모바일 대응

### 뉴스 카드 (`src/components/article-card.tsx`, 기존)

- 컨테이너: `rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md`
- 상단: 카테고리 뱃지(파란색) + 국내/해외 뱃지(회색), `rounded-full px-2.5 py-1 text-xs`
- 제목: `text-lg font-semibold line-clamp-2`
- 요약: `text-sm text-slate-600 line-clamp-3`
- 하단: 출처·언어·날짜(좌) + "원문 보기" 링크(우), `text-xs text-slate-400`

## 타이포그래피

- 페이지 타이틀: `text-xl font-bold tracking-tight`
- 카드 제목: `text-lg font-semibold`
- 본문: `text-sm leading-relaxed`
- 메타 정보: `text-xs`

## 상호작용 원칙

- 모든 호버 상태는 그림자(`hover:shadow-md`)나 배경색(`hover:bg-slate-100`)의 미세한 변화로만 표현, 과한 애니메이션 없음
- 포커스 가능한 요소(버튼, 링크)는 명확한 대비와 `rounded-full`/`rounded-2xl`로 통일된 곡률 사용
- 다크 모드는 `dark:` variant로 색상만 전환, 레이아웃 변경 없음
