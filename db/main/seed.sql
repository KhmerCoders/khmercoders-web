-- Seed file with fake data for development and testing
-- Contains only GitHub accounts as requested
-- Generated on June 8, 2025

-- User data (only users with GitHub accounts)
INSERT INTO `user` (`id`, `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at`, `reputation`, `level`)
VALUES
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB', 'Visal In', 'visal@example.com', 1, 'https://randomuser.me/api/portraits/men/1.jpg', 1717247622, 1717247622, 25, 20),
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC', 'Srey Pich', 'srey.pich@example.com', 1, 'https://randomuser.me/api/portraits/women/2.jpg', 1717247622, 1717247622, 150, 5),
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD', 'Sokha Meas', 'sokha.meas@example.com', 1, 'https://randomuser.me/api/portraits/men/3.jpg', 1717247622, 1717247622, 75, 8),
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE', 'Sophea Heng', 'sophea.heng@example.com', 1, 'https://randomuser.me/api/portraits/women/4.jpg', 1717247622, 1717247622, 50, 0),
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF', 'Rithy Chhay', 'rithy.chhay@example.com', 1, 'https://randomuser.me/api/portraits/men/5.jpg', 1717247622, 1717247622, 100, 10),
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG', 'Dara', 'admin@khmercoders.org', 1, 'https://randomuser.me/api/portraits/men/9.jpg', 1717247622, 1717247622, 500, 1);

-- Account data (GitHub accounts only)
INSERT INTO `account` (`id`, `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `scope`, `password`, `created_at`, `updated_at`)
VALUES
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZH', '12345', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB', 'gho_fakeaccesstoken123456789', 'ghr_fakerefreshtoken123456789', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622),
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZI', '23456', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC', 'gho_fakeaccesstoken234567890', 'ghr_fakerefreshtoken234567890', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622),
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZJ', '34567', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD', 'gho_fakeaccesstoken345678901', 'ghr_fakerefreshtoken345678901', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622),
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZK', '45678', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE', 'gho_fakeaccesstoken456789012', 'ghr_fakerefreshtoken456789012', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622),
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZL', '56789', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF', 'gho_fakeaccesstoken567890123', 'ghr_fakerefreshtoken567890123', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622),
  ('acc_01HQTG5BBRX3XY1JJVNN6CZ7ZM', '67890', 'github', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG', 'gho_fakeaccesstoken678901234', 'ghr_fakerefreshtoken678901234', NULL, 1717334022, 1719839222, 'read:user,user:email', NULL, 1717247622, 1717247622);

-- Email authentication accounts (password hashes are fake)
INSERT INTO `account` (`id`, `account_id`, `provider_id`, `user_id`, `access_token`, `refresh_token`, `id_token`, `access_token_expires_at`, `refresh_token_expires_at`, `scope`, `password`, `created_at`, `updated_at`)
VALUES
  ('acc_01HQTG5CDEF3XY1JJVNN6CZ7Z1', 'visal@example.com', 'credential', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB', NULL, NULL, NULL, NULL, NULL, NULL, 'c95140c0a8f4fceb2930138ae2f22967:c088d7e4f05d700f1a5bf49aaf13c2012a425ae0eedb9602131bb9d9d1caa4ec74e29a797a50c9af95b482edea4525f2010033ce3008424b23d1a7b7e3213955', 1717247622, 1717247622),
  ('acc_01HQTG5CDEF3XY1JJVNN6CZ7Z2', 'srey.pich@example.com', 'credential', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC', NULL, NULL, NULL, NULL, NULL, NULL, 'c95140c0a8f4fceb2930138ae2f22967:c088d7e4f05d700f1a5bf49aaf13c2012a425ae0eedb9602131bb9d9d1caa4ec74e29a797a50c9af95b482edea4525f2010033ce3008424b23d1a7b7e3213955', 1717247622, 1717247622),
  ('acc_01HQTG5CDEF3XY1JJVNN6CZ7Z3', 'sokha.meas@example.com', 'credential', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD', NULL, NULL, NULL, NULL, NULL, NULL, 'c95140c0a8f4fceb2930138ae2f22967:c088d7e4f05d700f1a5bf49aaf13c2012a425ae0eedb9602131bb9d9d1caa4ec74e29a797a50c9af95b482edea4525f2010033ce3008424b23d1a7b7e3213955', 1717247622, 1717247622),
  ('acc_01HQTG5CDEF3XY1JJVNN6CZ7Z4', 'admin@khmercoders.org', 'credential', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG', NULL, NULL, NULL, NULL, NULL, NULL, 'c95140c0a8f4fceb2930138ae2f22967:c088d7e4f05d700f1a5bf49aaf13c2012a425ae0eedb9602131bb9d9d1caa4ec74e29a797a50c9af95b482edea4525f2010033ce3008424b23d1a7b7e3213955', 1717247622, 1717247622);

-- Active sessions for GitHub users (Tokens would be much longer in production)
INSERT INTO `session` (`id`, `expires_at`, `token`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `user_id`)
VALUES
  ('ses_01HQTG5BBRX3XY1JJVNN6CZ7ZN', 1719839222, 'fake_session_token_12345', 1717247622, 1717247622, '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB'),
  ('ses_01HQTG5BBRX3XY1JJVNN6CZ7ZO', 1719839222, 'fake_session_token_23456', 1717247622, 1717247622, '192.168.1.2', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC'),
  ('ses_01HQTG5BBRX3XY1JJVNN6CZ7ZP', 1719839222, 'fake_session_token_34567', 1717247622, 1717247622, '192.168.1.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD'),
  ('ses_01HQTG5BBRX3XY1JJVNN6CZ7ZQ', 1719839222, 'fake_session_token_45678', 1717247622, 1717247622, '192.168.1.4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69', 'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG');

-- Member profile data for users with different levels
INSERT INTO `member_profile` (
  `user_id`, 
  `alias`, 
  `alias_updated_at`, 
  `picture`, 
  `title`, 
  `bio`, 
  `website_url`, 
  `telegram_url`, 
  `github_url`, 
  `facebook_url`, 
  `x_url`, 
  `tiktok_url`, 
  `instagram_url`, 
  `linkedin_url`, 
  `youtube_url`, 
  `created_at`, 
  `updated_at`
)
VALUES
  -- Regular User (Level 1)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB', 
   'darasok', 
   1717247622, 
   'https://randomuser.me/api/portraits/men/1.jpg', 
   'Junior Developer', 
   'Enthusiastic junior developer passionate about web technologies. Recently joined Khmer Coders to improve my skills and connect with the community.', 
   'https://dara-portfolio.example.com', 
   'https://t.me/darasok', 
   'https://github.com/darasok', 
   'https://facebook.com/darasok', 
   NULL, 
   NULL, 
   'https://instagram.com/darasok', 
   'https://linkedin.com/in/darasok', 
   NULL, 
   1717247622, 
   1717247622
  ),
  
  -- Premium User (Level 5)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC', 
   'sreypich', 
   1717247622, 
   'https://randomuser.me/api/portraits/women/2.jpg', 
   'Senior Frontend Developer', 
   'Senior developer specializing in React and Vue.js with 5+ years of experience. Active contributor to Khmer Coders community projects and regular speaker at local tech events.', 
   'https://sreypich-dev.example.com', 
   'https://t.me/sreypich', 
   'https://github.com/sreypich', 
   'https://facebook.com/sreypich', 
   'https://x.com/sreypich', 
   'https://tiktok.com/@sreypich.codes', 
   'https://instagram.com/sreypich.codes', 
   'https://linkedin.com/in/sreypich-dev', 
   'https://youtube.com/c/SreyPichCodes', 
   1717247622, 
   1717247622
  ),
  
  -- Volunteer User (Level 8)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD', 
   'sokhameas', 
   1717247622, 
   'https://randomuser.me/api/portraits/men/3.jpg', 
   'Community Organizer & Backend Developer', 
   'Backend developer and community organizer for Khmer Coders. Helping to organize events, workshops and coordinate volunteer activities. Passionate about giving back to the tech community in Cambodia.', 
   'https://sokha.example.com', 
   'https://t.me/sokhameas', 
   'https://github.com/sokhameas', 
   'https://facebook.com/sokhameas', 
   'https://x.com/sokhameas', 
   NULL, 
   'https://instagram.com/sokhameas', 
   'https://linkedin.com/in/sokhameas', 
   NULL, 
   1717247622, 
   1717247622
  ),
  
  -- Basic User (Level 0)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE', 
   'sopheaheng', 
   1717247622, 
   'https://randomuser.me/api/portraits/women/4.jpg', 
   'CS Student', 
   'Computer Science student at Royal University of Phnom Penh. New to coding and excited to learn through the Khmer Coders community.', 
   NULL, 
   'https://t.me/sopheaheng', 
   'https://github.com/sopheaheng', 
   'https://facebook.com/sopheaheng', 
   NULL, 
   NULL, 
   'https://instagram.com/sopheaheng', 
   NULL, 
   NULL, 
   1717247622, 
   1717247622
  ),
  
  -- Moderator User (Level 10)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF', 
   'rithychhay', 
   1717247622, 
   'https://randomuser.me/api/portraits/men/5.jpg', 
   'Community Moderator & Full Stack Developer', 
   'Experienced full stack developer and community moderator for Khmer Coders. Helping maintain community standards and mentoring newer members. Specializes in MERN stack and cloud infrastructure.', 
   'https://rithy-dev.example.com', 
   'https://t.me/rithychhay', 
   'https://github.com/rithychhay', 
   'https://facebook.com/rithychhay', 
   'https://x.com/rithychhay', 
   'https://tiktok.com/@rithycodes', 
   'https://instagram.com/rithychhay', 
   'https://linkedin.com/in/rithychhay', 
   'https://youtube.com/c/RithyTech', 
   1717247622, 
   1717247622
  ),
  
  -- Super Admin (Level 20)
  ('usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG', 
   'admin', 
   1717247622, 
   'https://randomuser.me/api/portraits/men/9.jpg', 
   'Founder & Lead Developer', 
   'Founder and lead developer of Khmer Coders. Working to build and grow Cambodia''s largest coding community. Passionate about empowering local developers and creating opportunities in tech.', 
   'https://khmercoders.org', 
   'https://t.me/khmercoders', 
   'https://github.com/khmercoders', 
   'https://facebook.com/khmercoders', 
   'https://x.com/khmercoders', 
   'https://tiktok.com/@khmercoders', 
   'https://instagram.com/khmercoders', 
   'https://linkedin.com/company/khmercoders', 
   'https://youtube.com/c/KhmerCoders', 
   1717247622, 
   1717247622
  );
