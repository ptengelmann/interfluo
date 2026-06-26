CREATE TABLE "firm_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"firm_id" text NOT NULL,
	"kind" text NOT NULL,
	"filename" text NOT NULL,
	"storage_key" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
