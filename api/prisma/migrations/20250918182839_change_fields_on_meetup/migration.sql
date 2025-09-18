/*
  Warnings:

  - You are about to drop the column `datetime` on the `meetup` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `meetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `meetup` DROP COLUMN `datetime`,
    DROP COLUMN `locationName`,
    ADD COLUMN `end` DATETIME(3) NULL,
    ADD COLUMN `location_name` VARCHAR(191) NULL,
    ADD COLUMN `start` DATETIME(3) NULL;
