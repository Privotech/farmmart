-- CreateTable
CREATE TABLE `animals` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(200) NOT NULL,
    `category` ENUM('CATTLE', 'GOAT', 'SHEEP', 'PIG', 'POULTRY', 'RABBIT', 'HORSE', 'OTHER') NOT NULL,
    `breed` VARCHAR(150) NULL,
    `age` INTEGER NULL,
    `weight` DECIMAL(8, 2) NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `description` TEXT NULL,
    `images` LONGTEXT NOT NULL,
    `status` ENUM('AVAILABLE', 'SOLD', 'RESERVED') NOT NULL DEFAULT 'AVAILABLE',
    `location` VARCHAR(200) NULL,
    `state` VARCHAR(100) NULL,
    `is_negotiable` BOOLEAN NOT NULL DEFAULT false,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `seller_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_animals_category`(`category`),
    INDEX `idx_animals_created_at`(`created_at`),
    INDEX `idx_animals_price`(`price`),
    INDEX `idx_animals_seller_id`(`seller_id`),
    INDEX `idx_animals_state`(`state`),
    INDEX `idx_animals_status`(`status`),
    FULLTEXT INDEX `ft_animals_search`(`name`, `breed`, `description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `user_id` VARCHAR(36) NOT NULL,
    `animal_id` VARCHAR(36) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_cart_animal`(`animal_id`),
    INDEX `idx_cart_user_id`(`user_id`),
    UNIQUE INDEX `uq_cart_user_animal`(`user_id`, `animal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiries` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `sender_id` VARCHAR(36) NOT NULL,
    `receiver_id` VARCHAR(36) NOT NULL,
    `animal_id` VARCHAR(36) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'REPLIED') NOT NULL DEFAULT 'UNREAD',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_inquiries_animal_id`(`animal_id`),
    INDEX `idx_inquiries_receiver_id`(`receiver_id`),
    INDEX `idx_inquiries_sender_id`(`sender_id`),
    INDEX `idx_inquiries_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `buyer_id` VARCHAR(36) NOT NULL,
    `animal_id` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paystack_ref` VARCHAR(200) NOT NULL,
    `paystack_channel` VARCHAR(50) NULL,
    `delivery_address` TEXT NULL,
    `delivery_state` VARCHAR(100) NULL,
    `delivery_city` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `paid_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_orders_paystack_ref`(`paystack_ref`),
    INDEX `idx_orders_animal_id`(`animal_id`),
    INDEX `idx_orders_buyer_id`(`buyer_id`),
    INDEX `idx_orders_created_at`(`created_at`),
    INDEX `idx_orders_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `user_id` VARCHAR(36) NOT NULL,
    `animal_id` VARCHAR(36) NOT NULL,
    `rating` TINYINT NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_reviews_animal_id`(`animal_id`),
    INDEX `idx_reviews_rating`(`rating`),
    UNIQUE INDEX `uq_reviews_user_animal`(`user_id`, `animal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL DEFAULT (uuid()),
    `firebase_uid` VARCHAR(128) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `role` ENUM('BUYER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'BUYER',
    `avatar_url` TEXT NULL,
    `address` TEXT NULL,
    `state` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_users_firebase_uid`(`firebase_uid`),
    UNIQUE INDEX `uq_users_email`(`email`),
    INDEX `idx_users_role`(`role`),
    INDEX `idx_users_state`(`state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,

    UNIQUE INDEX `LoginAttempt_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordReset_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `animals` ADD CONSTRAINT `fk_animals_seller` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `fk_cart_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `fk_inquiries_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `fk_inquiries_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `fk_inquiries_sender` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
