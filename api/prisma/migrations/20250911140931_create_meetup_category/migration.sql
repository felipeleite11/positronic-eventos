/*
  Warnings:

  - Added the required column `category_id` to the `meetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetup` ADD COLUMN `category_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meetup` ADD CONSTRAINT `meetup_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
