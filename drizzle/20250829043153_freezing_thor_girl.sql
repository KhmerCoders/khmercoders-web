CREATE TABLE `showcase` (
	`id` text PRIMARY KEY NOT NULL,
	`alias` text NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`website_url` text NOT NULL,
	`github_url` text NOT NULL,
	`logo` text NOT NULL,
	`cover_image` text NOT NULL,
	`like_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`review_status` text DEFAULT 'pending' NOT NULL,
	`review_by` text
);
