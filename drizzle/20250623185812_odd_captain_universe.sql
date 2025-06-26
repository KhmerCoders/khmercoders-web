CREATE TABLE `shortened_links` (
	`id` text PRIMARY KEY NOT NULL,
	`original_url` text NOT NULL,
	`slug` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shortened_links_slug_unique` ON `shortened_links` (`slug`);