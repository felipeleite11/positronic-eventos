/*
  Warnings:

  - You are about to drop the `MeetupInviteSheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MeetupInviteSheet` DROP FOREIGN KEY `MeetupInviteSheet_meetupId_fkey`;

-- DropTable
DROP TABLE `MeetupInviteSheet`;

-- CreateTable
CREATE TABLE `meetup_invite_sheet` (
    `id` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `meetup_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meetup_invite_sheet` ADD CONSTRAINT `meetup_invite_sheet_meetup_id_fkey` FOREIGN KEY (`meetup_id`) REFERENCES `meetup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
