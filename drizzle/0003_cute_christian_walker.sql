CREATE TABLE "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdById" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;