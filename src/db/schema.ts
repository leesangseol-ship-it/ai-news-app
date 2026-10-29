import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  source: text("source").notNull(),
  isDomestic: boolean("is_domestic").notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  originalTitle: text("original_title").notNull(),
  originalContent: text("original_content"),
  author: text("author"),
  translatedTitle: text("translated_title"),
  translatedContent: text("translated_content"),
  summary: text("summary").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  publishedAt: timestamp("published_at"),
  collectedAt: timestamp("collected_at").notNull().defaultNow(),
  lastCollectedAt: timestamp("last_collected_at").notNull().defaultNow(),
  notionSynced: boolean("notion_synced").notNull().default(false),
  processingStatus: varchar("processing_status", { length: 20 })
    .notNull()
    .default("pending"),
  processingError: text("processing_error"),
});
