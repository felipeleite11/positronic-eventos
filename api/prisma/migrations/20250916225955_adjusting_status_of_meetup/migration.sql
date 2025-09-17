/*
  Warnings:

  - You are about to alter the column `status` on the `meetup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `meetup` MODIFY `status` ENUM('created', 'in_subscription', 'in_progress', 'finished', 'cancelled') NOT NULL DEFAULT 'created';
