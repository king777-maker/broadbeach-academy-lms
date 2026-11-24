-- ============================================================================
-- BROADBEACH LMS — GoDaddy MySQL / MariaDB Database Migration
-- Table: certificates (Central Persistent Store for Online Cert Master)
-- Compatible with MySQL 5.7+, MySQL 8.0+, and MariaDB (GoDaddy cPanel phpMyAdmin)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create certificates table if it does not exist
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `certificate_code` VARCHAR(100) NOT NULL,
  `certificate_number` VARCHAR(100) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `student_email` VARCHAR(255) NOT NULL,
  `course_id` VARCHAR(100) NOT NULL,
  `course_title` VARCHAR(255) NOT NULL,
  `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `total_questions` INT NOT NULL DEFAULT 10,
  `percentage` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  `issue_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `issued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `certificate_url` VARCHAR(500) NULL DEFAULT NULL,
  `pdf_path` VARCHAR(500) NULL DEFAULT NULL,
  `status` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid',
  `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid',
  `revoked_at` DATETIME NULL DEFAULT NULL,
  `revoked_by` VARCHAR(191) NULL DEFAULT NULL,
  `revocation_reason` TEXT NULL DEFAULT NULL,
  `reissued_at` DATETIME NULL DEFAULT NULL,
  `source` VARCHAR(50) NOT NULL DEFAULT 'online',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_certificate_code` (`certificate_code`),
  INDEX `idx_certificate_number` (`certificate_number`),
  INDEX `idx_user_course` (`user_id`, `course_id`),
  INDEX `idx_student_email` (`student_email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_issue_date` (`issue_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Upgrade existing certificates table if columns are missing
-- (These will execute safely if the table already existed with older schema)
ALTER TABLE `certificates` 
  ADD COLUMN IF NOT EXISTS `certificate_code` VARCHAR(100) NULL AFTER `id`,
  ADD COLUMN IF NOT EXISTS `certificate_number` VARCHAR(100) NULL AFTER `certificate_code`,
  ADD COLUMN IF NOT EXISTS `user_id` BIGINT UNSIGNED NULL DEFAULT NULL AFTER `certificate_number`,
  ADD COLUMN IF NOT EXISTS `student_name` VARCHAR(255) NULL AFTER `user_id`,
  ADD COLUMN IF NOT EXISTS `student_email` VARCHAR(255) NULL AFTER `student_name`,
  ADD COLUMN IF NOT EXISTS `course_id` VARCHAR(100) NULL AFTER `student_email`,
  ADD COLUMN IF NOT EXISTS `course_title` VARCHAR(255) NULL AFTER `course_id`,
  ADD COLUMN IF NOT EXISTS `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 AFTER `course_title`,
  ADD COLUMN IF NOT EXISTS `total_questions` INT NOT NULL DEFAULT 10 AFTER `score`,
  ADD COLUMN IF NOT EXISTS `percentage` DECIMAL(5,2) NOT NULL DEFAULT 100.00 AFTER `total_questions`,
  ADD COLUMN IF NOT EXISTS `issue_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `percentage`,
  ADD COLUMN IF NOT EXISTS `issued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `issue_date`,
  ADD COLUMN IF NOT EXISTS `certificate_url` VARCHAR(500) NULL DEFAULT NULL AFTER `issued_at`,
  ADD COLUMN IF NOT EXISTS `pdf_path` VARCHAR(500) NULL DEFAULT NULL AFTER `certificate_url`,
  ADD COLUMN IF NOT EXISTS `status` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid' AFTER `pdf_path`,
  ADD COLUMN IF NOT EXISTS `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid' AFTER `status`,
  ADD COLUMN IF NOT EXISTS `revoked_at` DATETIME NULL DEFAULT NULL AFTER `verification_status`,
  ADD COLUMN IF NOT EXISTS `revoked_by` VARCHAR(191) NULL DEFAULT NULL AFTER `revoked_at`,
  ADD COLUMN IF NOT EXISTS `revocation_reason` TEXT NULL DEFAULT NULL AFTER `revoked_by`,
  ADD COLUMN IF NOT EXISTS `reissued_at` DATETIME NULL DEFAULT NULL AFTER `revocation_reason`,
  ADD COLUMN IF NOT EXISTS `source` VARCHAR(50) NOT NULL DEFAULT 'online' AFTER `reissued_at`,
  ADD COLUMN IF NOT EXISTS `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `source`,
  ADD COLUMN IF NOT EXISTS `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- 3. Synchronize certificate_code and certificate_number if one was null
UPDATE `certificates` 
SET `certificate_code` = `certificate_number` 
WHERE `certificate_code` IS NULL OR `certificate_code` = '';

UPDATE `certificates` 
SET `certificate_number` = `certificate_code` 
WHERE `certificate_number` IS NULL OR `certificate_number` = '';

SET FOREIGN_KEY_CHECKS = 1;
