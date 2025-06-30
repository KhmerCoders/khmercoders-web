CREATE TABLE `user_upload_binding` (
	`resource_type` text NOT NULL,
	`resource_id` text NOT NULL,
	`user_upload_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`resource_type`, `resource_id`, `user_upload_id`),
	FOREIGN KEY (`user_upload_id`) REFERENCES `user_upload`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_upload_binding_user_upload_id_idx` ON `user_upload_binding` (`user_upload_id`);