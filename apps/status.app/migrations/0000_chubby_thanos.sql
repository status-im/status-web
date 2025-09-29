DO $$ BEGIN
 CREATE TYPE "public"."epic_status" AS ENUM('done', 'in-progress', 'not-started');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."app" AS ENUM('shell', 'communities', 'messenger', 'wallet', 'browser', 'node');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "epics" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512) NOT NULL,
	"color" varchar(36) NOT NULL,
	"status" "epic_status" DEFAULT 'not-started' NOT NULL,
	CONSTRAINT "epics_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "epics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" varchar(512) NOT NULL,
	"position" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "milestones_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestones_to_epics" (
	"milestone_id" integer NOT NULL,
	"epic_id" integer NOT NULL,
	CONSTRAINT "milestones_to_epics_milestone_id_epic_id_pk" PRIMARY KEY("milestone_id","epic_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"position" integer NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" varchar(512) NOT NULL,
	"app" "app" NOT NULL,
	CONSTRAINT "projects_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "projects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "releases_to_milestones" (
	"release_id" integer NOT NULL,
	"milestone_id" integer NOT NULL,
	CONSTRAINT "releases_to_milestones_release_id_milestone_id_pk" PRIMARY KEY("release_id","milestone_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"contributor_id" varchar(12) NOT NULL,
	"start_of_week" timestamp with time zone NOT NULL,
	"time_off" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "reports_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports_to_milestones" (
	"report_id" integer NOT NULL,
	"milestone_id" integer NOT NULL,
	"time_spent" integer NOT NULL,
	CONSTRAINT "reports_to_milestones_report_id_milestone_id_pk" PRIMARY KEY("report_id","milestone_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"contributor_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(256) NOT NULL,
	"can_manage_admin" boolean DEFAULT false NOT NULL,
	"can_edit_insights" boolean DEFAULT false NOT NULL,
	"can_edit_keycard" boolean DEFAULT false NOT NULL,
	"can_view_insights" boolean DEFAULT false NOT NULL,
	"can_view_keycard" boolean DEFAULT false NOT NULL,
	"can_edit_reports" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_contributor_id_unique" UNIQUE("contributor_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workstreams" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512) NOT NULL,
	"color" varchar(36) NOT NULL,
	"emoji" varchar(12) NOT NULL,
	CONSTRAINT "workstreams_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "workstreams_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workstreams_to_projects" (
	"workstream_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "workstreams_to_projects_workstream_id_project_id_pk" PRIMARY KEY("workstream_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(30) NOT NULL,
	"url" varchar(300) NOT NULL,
	"milestone_id" integer NOT NULL,
	CONSTRAINT "milestone_links_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones_to_epics" ADD CONSTRAINT "milestones_to_epics_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestones_to_epics" ADD CONSTRAINT "milestones_to_epics_epic_id_epics_id_fk" FOREIGN KEY ("epic_id") REFERENCES "public"."epics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "releases_to_milestones" ADD CONSTRAINT "releases_to_milestones_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports_to_milestones" ADD CONSTRAINT "reports_to_milestones_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports_to_milestones" ADD CONSTRAINT "reports_to_milestones_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workstreams_to_projects" ADD CONSTRAINT "workstreams_to_projects_workstream_id_workstreams_id_fk" FOREIGN KEY ("workstream_id") REFERENCES "public"."workstreams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workstreams_to_projects" ADD CONSTRAINT "workstreams_to_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
