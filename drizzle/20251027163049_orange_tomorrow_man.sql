ALTER TABLE `posts` ADD `parent_post_id` text;--> statement-breakpoint
CREATE INDEX `posts_parent_post_id_idx` ON `posts` (`parent_post_id`);