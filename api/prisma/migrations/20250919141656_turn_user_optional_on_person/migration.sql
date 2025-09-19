-- DropForeignKey
ALTER TABLE `person` DROP FOREIGN KEY `person_user_id_fkey`;

-- AlterTable
ALTER TABLE `person` MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `person` ADD CONSTRAINT `person_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
