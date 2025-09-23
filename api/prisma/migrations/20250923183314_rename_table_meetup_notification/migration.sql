/*
  Warnings:

  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_meetup_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_person_id_fkey`;

-- DropTable
DROP TABLE `notification`;

-- CreateTable
CREATE TABLE `meetup_notification` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `meetup_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meetup_notification` ADD CONSTRAINT `meetup_notification_meetup_id_fkey` FOREIGN KEY (`meetup_id`) REFERENCES `meetup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetup_notification` ADD CONSTRAINT `meetup_notification_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
