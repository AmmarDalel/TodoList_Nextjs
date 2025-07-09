CREATE TABLE "todolist_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "todolist_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
ALTER TABLE "todolist_account" ADD CONSTRAINT "todolist_account_userId_todolist_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."todolist_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todolist_user" ADD CONSTRAINT "todolist_user_email_unique" UNIQUE("email");