CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"source" text NOT NULL,
	"is_domestic" boolean NOT NULL,
	"language" varchar(10) NOT NULL,
	"original_title" text NOT NULL,
	"original_content" text,
	"translated_title" text,
	"translated_content" text,
	"summary" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"published_at" timestamp,
	"collected_at" timestamp DEFAULT now() NOT NULL,
	"last_collected_at" timestamp DEFAULT now() NOT NULL,
	"notion_synced" boolean DEFAULT false NOT NULL,
	CONSTRAINT "articles_url_unique" UNIQUE("url")
);
