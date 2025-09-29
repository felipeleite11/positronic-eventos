/*
  Warnings:

  - Added the required column `person_id` to the `meetup_invite_sheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `meetup_invite_sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `meetup_invite_sheet` ADD COLUMN `person_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `meetup_invite_sheet` ADD CONSTRAINT `meetup_invite_sheet_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
