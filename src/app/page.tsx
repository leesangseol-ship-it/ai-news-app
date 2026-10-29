import { UserButton } from "@clerk/nextjs";
import { AuthGate } from "@/components/auth-gate";
import { ArticleCard } from "@/components/article-card";

// shortcut: DB 연결 전 화면 확인용 목업 데이터. DATABASE_URL 연결되면 db 쿼리로 교체할 것.
const MOCK_ARTICLES = [
  {
    id: 1,
    url: "https://openai.com/blog/example-model-launch",
    source: "OpenAI Blog",
    isDomestic: false,
    language: "en",
    title: "OpenAI, 확장 컨텍스트 지원하는 차세대 추론 모델 공개",
    summary:
      "OpenAI가 기존 모델 대비 추론 정확도를 크게 개선하고 최대 100만 토큰 컨텍스트를 지원하는 신규 모델을 발표했다. 기업용 API는 다음 달부터 제공될 예정이다.",
    category: "모델 출시",
    publishedAt: new Date("2026-10-20T09:00:00"),
  },
  {
    id: 2,
    url: "https://techcrunch.com/example-anthropic-funding",
    source: "TechCrunch",
    isDomestic: false,
    language: "en",
    title: "앤트로픽, 대형 투자자 주도로 50억 달러 신규 투자 유치",
    summary:
      "앤트로픽이 신규 투자 라운드에서 50억 달러를 유치했다고 발표했다. 이번 투자는 모델 학습 인프라 확장과 안전성 연구에 집중적으로 사용될 예정이다.",
    category: "투자/기업",
    publishedAt: new Date("2026-10-22T14:30:00"),
  },
  {
    id: 3,
    url: "https://deepmind.google/discover/example-research-paper",
    source: "Google DeepMind",
    isDomestic: false,
    language: "en",
    title: "딥마인드, 단백질 구조 예측 분야 획기적 연구 결과 발표",
    summary:
      "구글 딥마인드 연구진이 기존 모델보다 정확도가 크게 향상된 단백질 구조 예측 알고리즘을 공개했다. 신약 개발 분야에 광범위한 영향을 미칠 것으로 예상된다.",
    category: "연구",
    publishedAt: new Date("2026-10-24T11:15:00"),
  },
  {
    id: 4,
    url: "https://theverge.com/example-eu-ai-regulation",
    source: "The Verge",
    isDomestic: false,
    language: "en",
    title: "EU, 고위험 AI 시스템 대상 AI법 시행 세부지침 확정",
    summary:
      "유럽연합이 고위험 인공지능 시스템에 적용되는 AI법 시행 세부지침을 확정했다. 위반 시 기업은 전 세계 매출의 최대 7%에 달하는 과징금을 부과받을 수 있다.",
    category: "정책/규제",
    publishedAt: new Date("2026-10-25T08:45:00"),
  },
  {
    id: 5,
    url: "https://reuters.com/example-meta-opensource-model",
    source: "Reuters",
    isDomestic: false,
    language: "en",
    title: "메타, 폐쇄형 모델에 대항하는 오픈 가중치 멀티모달 모델 공개",
    summary:
      "메타가 이미지·음성·텍스트를 동시에 처리하는 오픈 가중치 멀티모달 모델을 공개했다. 상업적 이용이 가능한 라이선스로 배포되어 개발자 생태계의 관심을 받고 있다.",
    category: "제품",
    publishedAt: new Date("2026-10-27T16:00:00"),
  },
];

export default function Home() {
  const items = MOCK_ARTICLES;

  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
              AI 뉴스
            </h1>
            <UserButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {items.length === 0 ? (
            <p className="py-20 text-center text-slate-400">
              아직 수집된 뉴스가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}
