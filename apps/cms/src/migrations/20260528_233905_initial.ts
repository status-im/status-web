import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Payload's `migrate` CLI does not auto-create a custom schema (the adapter
  // uses schemaName: 'payload'). Without this, a fresh/self-hosted Postgres
  // fails the first migration with: schema "payload" does not exist.
  // Keep this line if the initial migration is ever regenerated.
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload";`)

  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_builder_listing_settings_page" AS ENUM('ideas', 'rfps');
  CREATE TYPE "payload"."enum_builder_listing_settings_default_view" AS ENUM('grid', 'list');
  CREATE TYPE "payload"."enum_rfps_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_rfps_reward_currency" AS ENUM('USDC');
  CREATE TYPE "payload"."enum_ideas_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_ideas_reward_currency" AS ENUM('USDC');
  CREATE TYPE "payload"."enum_builder_resources_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_circles_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_circle_events_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_circle_initiatives_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_circle_resources_status" AS ENUM('draft', 'review', 'published', 'archived');
  CREATE TYPE "payload"."enum_content_change_requests_status" AS ENUM('draft', 'open', 'merged', 'closed');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"public_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"route" varchar,
  	"page" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_route" varchar,
  	"version_page" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."builder_hub_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"settings" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."builder_listing_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "payload"."enum_builder_listing_settings_page" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"breadcrumb_label" varchar NOT NULL,
  	"submit_cta_label" varchar NOT NULL,
  	"submit_cta_href" varchar NOT NULL,
  	"submit_cta_external" boolean DEFAULT false,
  	"default_view" "payload"."enum_builder_listing_settings_default_view" DEFAULT 'grid' NOT NULL,
  	"page_size" numeric NOT NULL,
  	"previous_label" varchar NOT NULL,
  	"next_label" varchar NOT NULL,
  	"bottom_cta_title" varchar NOT NULL,
  	"bottom_cta_label" varchar NOT NULL,
  	"bottom_cta_href" varchar NOT NULL,
  	"bottom_cta_external" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"settings" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_navigation_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"navigation" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_footer_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"footer" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."rfps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_rfps_status" DEFAULT 'draft' NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"summary" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar,
  	"reward_amount" numeric NOT NULL,
  	"reward_currency" "payload"."enum_rfps_reward_currency" DEFAULT 'USDC' NOT NULL,
  	"reward_xp" numeric,
  	"apply_url" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"published_at" timestamp(3) with time zone,
  	"closes_at" timestamp(3) with time zone,
  	"owner_name" varchar,
  	"owner_handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."rfps_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."ideas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_ideas_status" DEFAULT 'draft' NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"summary" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar,
  	"submitter_name" varchar,
  	"submitter_handle" varchar NOT NULL,
  	"reward_amount" numeric,
  	"reward_currency" "payload"."enum_ideas_reward_currency" DEFAULT 'USDC',
  	"reward_xp" numeric,
  	"discussion_url" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"submitted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."ideas_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."builder_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_builder_resources_status" DEFAULT 'draft' NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."circles_organizers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"handle" varchar
  );
  
  CREATE TABLE "payload"."circles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_circles_status" DEFAULT 'draft' NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"region" varchar,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"timezone" varchar NOT NULL,
  	"member_count" numeric,
  	"discord_channel" varchar,
  	"discord_url" varchar,
  	"forum_url" varchar,
  	"join_url" varchar NOT NULL,
  	"image_src" varchar,
  	"image_alt" varchar,
  	"image_width" numeric,
  	"image_height" numeric,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."circle_events_hosted_by" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."circle_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_circle_events_status" DEFAULT 'draft' NOT NULL,
  	"circle_slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"location_label" varchar NOT NULL,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"ends_at" timestamp(3) with time zone,
  	"timezone" varchar NOT NULL,
  	"venue_name" varchar,
  	"address" varchar,
  	"event_url" varchar,
  	"featured" boolean DEFAULT false,
  	"sequence_number" numeric,
  	"image_src" varchar,
  	"image_alt" varchar,
  	"image_width" numeric,
  	"image_height" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."circle_initiatives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_circle_initiatives_status" DEFAULT 'draft' NOT NULL,
  	"circle_slug" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"location_label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"image_src" varchar,
  	"image_alt" varchar,
  	"image_width" numeric,
  	"image_height" numeric,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."circle_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "payload"."enum_circle_resources_status" DEFAULT 'draft' NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."content_change_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_type" varchar NOT NULL,
  	"target_path" varchar NOT NULL,
  	"branch_name" varchar NOT NULL,
  	"pull_request_number" numeric,
  	"pull_request_url" varchar,
  	"status" "payload"."enum_content_change_requests_status" DEFAULT 'draft' NOT NULL,
  	"commit_sha" varchar,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."rfps_texts" ADD CONSTRAINT "rfps_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."rfps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."ideas_texts" ADD CONSTRAINT "ideas_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."ideas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."circles_organizers" ADD CONSTRAINT "circles_organizers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."circles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."circle_events_hosted_by" ADD CONSTRAINT "circle_events_hosted_by_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."circle_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."content_change_requests" ADD CONSTRAINT "content_change_requests_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE UNIQUE INDEX "pages_route_idx" ON "payload"."pages" USING btree ("route");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_route_idx" ON "payload"."_pages_v" USING btree ("version_route");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "builder_hub_settings_slug_idx" ON "payload"."builder_hub_settings" USING btree ("slug");
  CREATE INDEX "builder_hub_settings_updated_at_idx" ON "payload"."builder_hub_settings" USING btree ("updated_at");
  CREATE INDEX "builder_hub_settings_created_at_idx" ON "payload"."builder_hub_settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "builder_listing_settings_page_idx" ON "payload"."builder_listing_settings" USING btree ("page");
  CREATE INDEX "builder_listing_settings_updated_at_idx" ON "payload"."builder_listing_settings" USING btree ("updated_at");
  CREATE INDEX "builder_listing_settings_created_at_idx" ON "payload"."builder_listing_settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_settings_content_slug_idx" ON "payload"."site_settings_content" USING btree ("slug");
  CREATE INDEX "site_settings_content_updated_at_idx" ON "payload"."site_settings_content" USING btree ("updated_at");
  CREATE INDEX "site_settings_content_created_at_idx" ON "payload"."site_settings_content" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_navigation_content_slug_idx" ON "payload"."site_navigation_content" USING btree ("slug");
  CREATE INDEX "site_navigation_content_updated_at_idx" ON "payload"."site_navigation_content" USING btree ("updated_at");
  CREATE INDEX "site_navigation_content_created_at_idx" ON "payload"."site_navigation_content" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_footer_content_slug_idx" ON "payload"."site_footer_content" USING btree ("slug");
  CREATE INDEX "site_footer_content_updated_at_idx" ON "payload"."site_footer_content" USING btree ("updated_at");
  CREATE INDEX "site_footer_content_created_at_idx" ON "payload"."site_footer_content" USING btree ("created_at");
  CREATE UNIQUE INDEX "rfps_slug_idx" ON "payload"."rfps" USING btree ("slug");
  CREATE INDEX "rfps_updated_at_idx" ON "payload"."rfps" USING btree ("updated_at");
  CREATE INDEX "rfps_created_at_idx" ON "payload"."rfps" USING btree ("created_at");
  CREATE INDEX "rfps_texts_order_parent" ON "payload"."rfps_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "ideas_slug_idx" ON "payload"."ideas" USING btree ("slug");
  CREATE INDEX "ideas_updated_at_idx" ON "payload"."ideas" USING btree ("updated_at");
  CREATE INDEX "ideas_created_at_idx" ON "payload"."ideas" USING btree ("created_at");
  CREATE INDEX "ideas_texts_order_parent" ON "payload"."ideas_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "builder_resources_slug_idx" ON "payload"."builder_resources" USING btree ("slug");
  CREATE INDEX "builder_resources_updated_at_idx" ON "payload"."builder_resources" USING btree ("updated_at");
  CREATE INDEX "builder_resources_created_at_idx" ON "payload"."builder_resources" USING btree ("created_at");
  CREATE INDEX "circles_organizers_order_idx" ON "payload"."circles_organizers" USING btree ("_order");
  CREATE INDEX "circles_organizers_parent_id_idx" ON "payload"."circles_organizers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "circles_slug_idx" ON "payload"."circles" USING btree ("slug");
  CREATE INDEX "circles_updated_at_idx" ON "payload"."circles" USING btree ("updated_at");
  CREATE INDEX "circles_created_at_idx" ON "payload"."circles" USING btree ("created_at");
  CREATE INDEX "circle_events_hosted_by_order_idx" ON "payload"."circle_events_hosted_by" USING btree ("_order");
  CREATE INDEX "circle_events_hosted_by_parent_id_idx" ON "payload"."circle_events_hosted_by" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "circle_events_slug_idx" ON "payload"."circle_events" USING btree ("slug");
  CREATE INDEX "circle_events_circle_slug_idx" ON "payload"."circle_events" USING btree ("circle_slug");
  CREATE INDEX "circle_events_updated_at_idx" ON "payload"."circle_events" USING btree ("updated_at");
  CREATE INDEX "circle_events_created_at_idx" ON "payload"."circle_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "circle_initiatives_slug_idx" ON "payload"."circle_initiatives" USING btree ("slug");
  CREATE INDEX "circle_initiatives_circle_slug_idx" ON "payload"."circle_initiatives" USING btree ("circle_slug");
  CREATE INDEX "circle_initiatives_updated_at_idx" ON "payload"."circle_initiatives" USING btree ("updated_at");
  CREATE INDEX "circle_initiatives_created_at_idx" ON "payload"."circle_initiatives" USING btree ("created_at");
  CREATE UNIQUE INDEX "circle_resources_slug_idx" ON "payload"."circle_resources" USING btree ("slug");
  CREATE INDEX "circle_resources_updated_at_idx" ON "payload"."circle_resources" USING btree ("updated_at");
  CREATE INDEX "circle_resources_created_at_idx" ON "payload"."circle_resources" USING btree ("created_at");
  CREATE INDEX "content_change_requests_content_type_idx" ON "payload"."content_change_requests" USING btree ("content_type");
  CREATE INDEX "content_change_requests_target_path_idx" ON "payload"."content_change_requests" USING btree ("target_path");
  CREATE UNIQUE INDEX "content_change_requests_branch_name_idx" ON "payload"."content_change_requests" USING btree ("branch_name");
  CREATE INDEX "content_change_requests_status_idx" ON "payload"."content_change_requests" USING btree ("status");
  CREATE INDEX "content_change_requests_created_by_idx" ON "payload"."content_change_requests" USING btree ("created_by_id");
  CREATE INDEX "content_change_requests_updated_at_idx" ON "payload"."content_change_requests" USING btree ("updated_at");
  CREATE INDEX "content_change_requests_created_at_idx" ON "payload"."content_change_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP TABLE "payload"."builder_hub_settings" CASCADE;
  DROP TABLE "payload"."builder_listing_settings" CASCADE;
  DROP TABLE "payload"."site_settings_content" CASCADE;
  DROP TABLE "payload"."site_navigation_content" CASCADE;
  DROP TABLE "payload"."site_footer_content" CASCADE;
  DROP TABLE "payload"."rfps" CASCADE;
  DROP TABLE "payload"."rfps_texts" CASCADE;
  DROP TABLE "payload"."ideas" CASCADE;
  DROP TABLE "payload"."ideas_texts" CASCADE;
  DROP TABLE "payload"."builder_resources" CASCADE;
  DROP TABLE "payload"."circles_organizers" CASCADE;
  DROP TABLE "payload"."circles" CASCADE;
  DROP TABLE "payload"."circle_events_hosted_by" CASCADE;
  DROP TABLE "payload"."circle_events" CASCADE;
  DROP TABLE "payload"."circle_initiatives" CASCADE;
  DROP TABLE "payload"."circle_resources" CASCADE;
  DROP TABLE "payload"."content_change_requests" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_version_status";
  DROP TYPE "payload"."enum_builder_listing_settings_page";
  DROP TYPE "payload"."enum_builder_listing_settings_default_view";
  DROP TYPE "payload"."enum_rfps_status";
  DROP TYPE "payload"."enum_rfps_reward_currency";
  DROP TYPE "payload"."enum_ideas_status";
  DROP TYPE "payload"."enum_ideas_reward_currency";
  DROP TYPE "payload"."enum_builder_resources_status";
  DROP TYPE "payload"."enum_circles_status";
  DROP TYPE "payload"."enum_circle_events_status";
  DROP TYPE "payload"."enum_circle_initiatives_status";
  DROP TYPE "payload"."enum_circle_resources_status";
  DROP TYPE "payload"."enum_content_change_requests_status";`)
}
