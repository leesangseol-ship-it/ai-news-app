ALTER TABLE "articles" ADD COLUMN "processing_status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "processing_error" text;