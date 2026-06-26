CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"firm_id" text NOT NULL,
	"matter_id" text,
	"user_id" text NOT NULL,
	"event_type" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
