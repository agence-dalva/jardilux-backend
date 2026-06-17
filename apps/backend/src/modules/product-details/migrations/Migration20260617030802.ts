import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260617030802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_details" ("id" text not null, "nettoyage" text null, "details_technique" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_details_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_details_deleted_at" ON "product_details" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_details" cascade;`);
  }

}
