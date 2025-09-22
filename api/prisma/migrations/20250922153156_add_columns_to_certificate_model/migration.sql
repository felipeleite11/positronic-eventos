/*
  Warnings:

  - Added the required column `content` to the `meetup_certificate_model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetup_certificate_model` ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
