drop policy "Enable delete access for auth users" on "public"."user_api_keys";

alter table "public"."helicone_api_keys" add column "id" bigint generated by default as identity not null;

alter table "public"."helicone_api_keys" add column "soft_delete" boolean not null default false;

alter table "public"."request" add column "helicone_api_key_id" bigint;

alter table "public"."request" add column "helicone_user" uuid;

alter table "public"."helicone_api_keys" drop constraint "helicone_api_keys_pkey";

drop index if exists "public"."helicone_api_keys_pkey";

CREATE UNIQUE INDEX helicone_api_keys_id_key ON public.helicone_api_keys USING btree (id);

CREATE UNIQUE INDEX helicone_api_keys_pkey ON public.helicone_api_keys USING btree (api_key_hash, id);

alter table "public"."helicone_api_keys" add constraint "helicone_api_keys_pkey" PRIMARY KEY using index "helicone_api_keys_pkey";

alter table "public"."helicone_api_keys" add constraint "helicone_api_keys_id_key" UNIQUE using index "helicone_api_keys_id_key";

alter table "public"."request" add constraint "request_helicone_api_key_id_fkey" FOREIGN KEY (helicone_api_key_id) REFERENCES helicone_api_keys(id) not valid;

alter table "public"."request" validate constraint "request_helicone_api_key_id_fkey";

alter table "public"."request" add constraint "request_helicone_user_fkey" FOREIGN KEY (helicone_user) REFERENCES auth.users(id) not valid;

alter table "public"."request" validate constraint "request_helicone_user_fkey";






