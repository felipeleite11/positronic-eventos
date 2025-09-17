-- CreateTable
CREATE TABLE `meetup_follower` (
    `id` VARCHAR(191) NOT NULL,
    `meetup_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `meetup_follower_meetup_id_person_id_key`(`meetup_id`, `person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meetup_follower` ADD CONSTRAINT `meetup_follower_meetup_id_fkey` FOREIGN KEY (`meetup_id`) REFERENCES `meetup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meetup_follower` ADD CONSTRAINT `meetup_follower_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
