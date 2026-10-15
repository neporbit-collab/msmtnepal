import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'publisher');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_service_status" AS ENUM('current', 'planned', 'confirm');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_service_status" AS ENUM('current', 'planned', 'confirm');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_items_category" AS ENUM('news', 'story', 'report', 'photo', 'video');
  CREATE TYPE "public"."enum_media_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_items_v_version_category" AS ENUM('news', 'story', 'report', 'photo', 'video');
  CREATE TYPE "public"."enum__media_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_inquiries_status" AS ENUM('new', 'in-progress', 'handled');
  CREATE TYPE "public"."enum_notices_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__notices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_quality_claims_for_review_status" AS ENUM('needs-review', 'approved');
  CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
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

  CREATE TABLE "pages_blocks_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"body" jsonb,
	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_highlights_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"value" varchar
  );

  CREATE TABLE "pages_blocks_highlights" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_image" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer,
	"alt" varchar,
	"block_name" varchar
  );

  CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"description" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"seo_share_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "_pages_v_blocks_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"body" jsonb,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_highlights_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"value" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_highlights" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_image" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer,
	"alt" varchar,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_description" varchar,
	"version_seo_title" varchar,
	"version_seo_description" varchar,
	"version_seo_share_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"summary" varchar,
	"body" jsonb,
	"service_status" "enum_services_service_status" DEFAULT 'confirm',
	"display_order" numeric DEFAULT 0,
	"seo_title" varchar,
	"seo_description" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_services_status" DEFAULT 'draft'
  );

  CREATE TABLE "_services_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_summary" varchar,
	"version_body" jsonb,
	"version_service_status" "enum__services_v_version_service_status" DEFAULT 'confirm',
	"version_display_order" numeric DEFAULT 0,
	"version_seo_title" varchar,
	"version_seo_description" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"role_title" varchar,
	"biography" varchar,
	"portrait_id" integer,
	"portrait_alt" varchar,
	"display_order" numeric DEFAULT 0,
	"active" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_team_members_status" DEFAULT 'draft'
  );

  CREATE TABLE "_team_members_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_name" varchar,
	"version_role_title" varchar,
	"version_biography" varchar,
	"version_portrait_id" integer,
	"version_portrait_alt" varchar,
	"version_display_order" numeric DEFAULT 0,
	"version_active" boolean DEFAULT true,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "media_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"category" "enum_media_items_category",
	"summary" varchar,
	"body" jsonb,
	"published_at" timestamp(3) with time zone,
	"cover_image_id" integer,
	"image_alt" varchar,
	"file_id" integer,
	"credit" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_media_items_status" DEFAULT 'draft'
  );

  CREATE TABLE "_media_items_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_category" "enum__media_items_v_version_category",
	"version_summary" varchar,
	"version_body" jsonb,
	"version_published_at" timestamp(3) with time zone,
	"version_cover_image_id" integer,
	"version_image_alt" varchar,
	"version_file_id" integer,
	"version_credit" varchar,
	"version_seo_title" varchar,
	"version_seo_description" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__media_items_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar,
	"caption" varchar,
	"credit" varchar,
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
	"focal_y" numeric,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar,
	"sizes_thumb_url" varchar,
	"sizes_thumb_width" numeric,
	"sizes_thumb_height" numeric,
	"sizes_thumb_mime_type" varchar,
	"sizes_thumb_filesize" numeric,
	"sizes_thumb_filename" varchar
  );

  CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"subject" varchar NOT NULL,
	"message" varchar NOT NULL,
	"status" "enum_contact_inquiries_status" DEFAULT 'new',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"title_native" varchar,
	"summary" varchar,
	"published_at" timestamp(3) with time zone,
	"active" boolean DEFAULT true,
	"image_id" integer,
	"image_alt" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_notices_status" DEFAULT 'draft'
  );

  CREATE TABLE "_notices_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_title_native" varchar,
	"version_summary" varchar,
	"version_published_at" timestamp(3) with time zone,
	"version_active" boolean DEFAULT true,
	"version_image_id" integer,
	"version_image_alt" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__notices_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"pages_id" integer,
	"services_id" integer,
	"team_members_id" integer,
	"media_items_id" integer,
	"uploads_id" integer,
	"contact_inquiries_id" integer,
	"notices_id" integer
  );

  CREATE TABLE "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
  );

  CREATE TABLE "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_phones" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"phone" varchar NOT NULL
  );

  CREATE TABLE "site_settings_social_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"url" varchar
  );

  CREATE TABLE "site_settings_metrics_for_review" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar NOT NULL,
	"label" varchar NOT NULL,
	"verification" varchar
  );

  CREATE TABLE "site_settings_quality_claims_for_review" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"claim" varchar NOT NULL,
	"status" "enum_site_settings_quality_claims_for_review_status" DEFAULT 'needs-review'
  );

  CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_name" varchar DEFAULT 'Medical Services Management Trust Nepal (MSMT Nepal)',
	"address" varchar DEFAULT 'Chakupat, Lalitpur-11, Nepal',
	"email" varchar DEFAULT 'msmt.ngo.nepal@gmail.com',
	"map_link" varchar,
	"claims_review_note" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "announcement_popup" (
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false,
	"title" varchar,
	"message" varchar,
	"image_id" integer,
	"image_alt" varchar,
	"button_label" varchar,
	"button_url" varchar,
	"starts_at" timestamp(3) with time zone,
	"ends_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights_items" ADD CONSTRAINT "pages_blocks_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights" ADD CONSTRAINT "pages_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_share_image_id_uploads_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_items" ADD CONSTRAINT "_pages_v_blocks_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights" ADD CONSTRAINT "_pages_v_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_share_image_id_uploads_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_portrait_id_uploads_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_portrait_id_uploads_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_items" ADD CONSTRAINT "media_items_cover_image_id_uploads_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_items" ADD CONSTRAINT "media_items_file_id_uploads_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_items_v" ADD CONSTRAINT "_media_items_v_parent_id_media_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_items_v" ADD CONSTRAINT "_media_items_v_version_cover_image_id_uploads_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_items_v" ADD CONSTRAINT "_media_items_v_version_file_id_uploads_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices" ADD CONSTRAINT "notices_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_parent_id_notices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_version_image_id_uploads_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_items_fk" FOREIGN KEY ("media_items_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_inquiries_fk" FOREIGN KEY ("contact_inquiries_id") REFERENCES "public"."contact_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_phones" ADD CONSTRAINT "site_settings_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_metrics_for_review" ADD CONSTRAINT "site_settings_metrics_for_review_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_quality_claims_for_review" ADD CONSTRAINT "site_settings_quality_claims_for_review_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_popup" ADD CONSTRAINT "announcement_popup_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_highlights_items_order_idx" ON "pages_blocks_highlights_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_items_parent_id_idx" ON "pages_blocks_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_order_idx" ON "pages_blocks_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_parent_id_idx" ON "pages_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_path_idx" ON "pages_blocks_highlights" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_share_image_idx" ON "pages" USING btree ("seo_share_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlights_items_order_idx" ON "_pages_v_blocks_highlights_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_items_parent_id_idx" ON "_pages_v_blocks_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_order_idx" ON "_pages_v_blocks_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_parent_id_idx" ON "_pages_v_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_path_idx" ON "_pages_v_blocks_highlights" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_share_image_idx" ON "_pages_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "team_members_portrait_idx" ON "team_members" USING btree ("portrait_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_portrait_idx" ON "_team_members_v" USING btree ("version_portrait_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE UNIQUE INDEX "media_items_slug_idx" ON "media_items" USING btree ("slug");
  CREATE INDEX "media_items_cover_image_idx" ON "media_items" USING btree ("cover_image_id");
  CREATE INDEX "media_items_file_idx" ON "media_items" USING btree ("file_id");
  CREATE INDEX "media_items_updated_at_idx" ON "media_items" USING btree ("updated_at");
  CREATE INDEX "media_items_created_at_idx" ON "media_items" USING btree ("created_at");
  CREATE INDEX "media_items__status_idx" ON "media_items" USING btree ("_status");
  CREATE INDEX "_media_items_v_parent_idx" ON "_media_items_v" USING btree ("parent_id");
  CREATE INDEX "_media_items_v_version_version_slug_idx" ON "_media_items_v" USING btree ("version_slug");
  CREATE INDEX "_media_items_v_version_version_cover_image_idx" ON "_media_items_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_media_items_v_version_version_file_idx" ON "_media_items_v" USING btree ("version_file_id");
  CREATE INDEX "_media_items_v_version_version_updated_at_idx" ON "_media_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_items_v_version_version_created_at_idx" ON "_media_items_v" USING btree ("version_created_at");
  CREATE INDEX "_media_items_v_version_version__status_idx" ON "_media_items_v" USING btree ("version__status");
  CREATE INDEX "_media_items_v_created_at_idx" ON "_media_items_v" USING btree ("created_at");
  CREATE INDEX "_media_items_v_updated_at_idx" ON "_media_items_v" USING btree ("updated_at");
  CREATE INDEX "_media_items_v_latest_idx" ON "_media_items_v" USING btree ("latest");
  CREATE INDEX "uploads_updated_at_idx" ON "uploads" USING btree ("updated_at");
  CREATE INDEX "uploads_created_at_idx" ON "uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX "uploads_filename_idx" ON "uploads" USING btree ("filename");
  CREATE INDEX "uploads_sizes_card_sizes_card_filename_idx" ON "uploads" USING btree ("sizes_card_filename");
  CREATE INDEX "uploads_sizes_thumb_sizes_thumb_filename_idx" ON "uploads" USING btree ("sizes_thumb_filename");
  CREATE INDEX "contact_inquiries_updated_at_idx" ON "contact_inquiries" USING btree ("updated_at");
  CREATE INDEX "contact_inquiries_created_at_idx" ON "contact_inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "notices_slug_idx" ON "notices" USING btree ("slug");
  CREATE INDEX "notices_image_idx" ON "notices" USING btree ("image_id");
  CREATE INDEX "notices_updated_at_idx" ON "notices" USING btree ("updated_at");
  CREATE INDEX "notices_created_at_idx" ON "notices" USING btree ("created_at");
  CREATE INDEX "notices__status_idx" ON "notices" USING btree ("_status");
  CREATE INDEX "_notices_v_parent_idx" ON "_notices_v" USING btree ("parent_id");
  CREATE INDEX "_notices_v_version_version_slug_idx" ON "_notices_v" USING btree ("version_slug");
  CREATE INDEX "_notices_v_version_version_image_idx" ON "_notices_v" USING btree ("version_image_id");
  CREATE INDEX "_notices_v_version_version_updated_at_idx" ON "_notices_v" USING btree ("version_updated_at");
  CREATE INDEX "_notices_v_version_version_created_at_idx" ON "_notices_v" USING btree ("version_created_at");
  CREATE INDEX "_notices_v_version_version__status_idx" ON "_notices_v" USING btree ("version__status");
  CREATE INDEX "_notices_v_created_at_idx" ON "_notices_v" USING btree ("created_at");
  CREATE INDEX "_notices_v_updated_at_idx" ON "_notices_v" USING btree ("updated_at");
  CREATE INDEX "_notices_v_latest_idx" ON "_notices_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_media_items_id_idx" ON "payload_locked_documents_rels" USING btree ("media_items_id");
  CREATE INDEX "payload_locked_documents_rels_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("uploads_id");
  CREATE INDEX "payload_locked_documents_rels_contact_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("notices_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_phones_order_idx" ON "site_settings_phones" USING btree ("_order");
  CREATE INDEX "site_settings_phones_parent_id_idx" ON "site_settings_phones" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_metrics_for_review_order_idx" ON "site_settings_metrics_for_review" USING btree ("_order");
  CREATE INDEX "site_settings_metrics_for_review_parent_id_idx" ON "site_settings_metrics_for_review" USING btree ("_parent_id");
  CREATE INDEX "site_settings_quality_claims_for_review_order_idx" ON "site_settings_quality_claims_for_review" USING btree ("_order");
  CREATE INDEX "site_settings_quality_claims_for_review_parent_id_idx" ON "site_settings_quality_claims_for_review" USING btree ("_parent_id");
  CREATE INDEX "announcement_popup_image_idx" ON "announcement_popup" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_highlights_items" CASCADE;
  DROP TABLE "pages_blocks_highlights" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights_items" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "media_items" CASCADE;
  DROP TABLE "_media_items_v" CASCADE;
  DROP TABLE "uploads" CASCADE;
  DROP TABLE "contact_inquiries" CASCADE;
  DROP TABLE "notices" CASCADE;
  DROP TABLE "_notices_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_phones" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_metrics_for_review" CASCADE;
  DROP TABLE "site_settings_quality_claims_for_review" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "announcement_popup" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_services_service_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_service_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_media_items_category";
  DROP TYPE "public"."enum_media_items_status";
  DROP TYPE "public"."enum__media_items_v_version_category";
  DROP TYPE "public"."enum__media_items_v_version_status";
  DROP TYPE "public"."enum_contact_inquiries_status";
  DROP TYPE "public"."enum_notices_status";
  DROP TYPE "public"."enum__notices_v_version_status";
  DROP TYPE "public"."enum_site_settings_quality_claims_for_review_status";`)
}
