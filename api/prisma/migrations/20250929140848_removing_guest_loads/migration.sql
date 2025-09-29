/*
  Warnings:

  - You are about to drop the `guest_load` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `guest_load` DROP FOREIGN KEY `guest_load_meetup_id_fkey`;

-- DropForeignKey
ALTER TABLE `guest_load` DROP FOREIGN KEY `guest_load_person_id_fkey`;

-- DropTable
DROP TABLE `guest_load`;
