-- CreateTable
CREATE TABLE `MeetupInviteSheet` (
    `id` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `meetupId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MeetupInviteSheet` ADD CONSTRAINT `MeetupInviteSheet_meetupId_fkey` FOREIGN KEY (`meetupId`) REFERENCES `meetup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
