/*
  Warnings:

  - Added the required column `creator_id` to the `meetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetup` ADD COLUMN `creator_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `meetup` ADD CONSTRAINT `meetup_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
