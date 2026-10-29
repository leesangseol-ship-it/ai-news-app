export type RssSource = {
  name: string;
  url: string;
  isDomestic: boolean;
  language: string;
};

export const RSS_SOURCES: RssSource[] = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    isDomestic: false,
    language: "en",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    isDomestic: false,
    language: "en",
  },
];
