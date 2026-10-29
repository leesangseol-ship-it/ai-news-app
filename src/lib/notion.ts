const NOTION_API_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

function languageLabel(language: string) {
  if (language === "ko") return "한국어";
  if (language === "en") return "영어";
  return "기타";
}

export async function syncArticleToNotion(article: {
  title: string;
  summary: string;
  category: string;
  url: string;
  source: string;
  language: string;
  publishedAt: Date | null;
  collectedAt: Date;
}) {
  const res = await fetch(NOTION_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        제목: { title: [{ text: { content: article.title.slice(0, 2000) } }] },
        요약: { rich_text: [{ text: { content: article.summary.slice(0, 2000) } }] },
        카테고리: { select: { name: article.category } },
        "원문 링크": { url: article.url },
        출처: { rich_text: [{ text: { content: article.source } }] },
        언어: { select: { name: languageLabel(article.language) } },
        ...(article.publishedAt
          ? { 날짜: { date: { start: article.publishedAt.toISOString() } } }
          : {}),
        수집일시: { date: { start: article.collectedAt.toISOString() } },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion sync failed: ${res.status} ${await res.text()}`);
  }
}
