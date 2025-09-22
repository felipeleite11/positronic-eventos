/*
  Warnings:

  - A unique constraint covering the columns `[certificate_model_id]` on the table `meetup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `meetup` ADD COLUMN `certificate_model_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `meetup_certificate_model` (
    `id` VARCHAR(191) NOT NULL,
    `image_link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `meetup_certificate_model_id_key` ON `meetup`(`certificate_model_id`);

-- AddForeignKey
ALTER TABLE `meetup` ADD CONSTRAINT `meetup_certificate_model_id_fkey` FOREIGN KEY (`certificate_model_id`) REFERENCES `meetup_certificate_model`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
