-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "animals_category" AS ENUM ('CATTLE', 'GOAT', 'SHEEP', 'PIG', 'POULTRY', 'RABBIT', 'HORSE', 'OTHER');

-- CreateEnum
CREATE TYPE "orders_status" AS ENUM ('PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "inquiries_status" AS ENUM ('UNREAD', 'READ', 'REPLIED');

-- CreateEnum
CREATE TYPE "users_role" AS ENUM ('BUYER', 'SELLER', 'ADMIN');

-- CreateEnum
CREATE TYPE "animals_status" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" "animals_category" NOT NULL,
    "breed" VARCHAR(150),
    "age" INTEGER,
    "weight" DECIMAL(8,2),
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "images" TEXT NOT NULL,
    "status" "animals_status" NOT NULL DEFAULT 'AVAILABLE',
    "location" VARCHAR(200),
    "state" VARCHAR(100),
    "is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "seller_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "status" "inquiries_status" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "orders_status" NOT NULL DEFAULT 'PENDING',
    "paystack_ref" VARCHAR(200) NOT NULL,
    "paystack_channel" VARCHAR(50),
    "delivery_address" TEXT,
    "delivery_phone" VARCHAR(20),
    "delivery_state" VARCHAR(100),
    "delivery_city" VARCHAR(100),
    "notes" TEXT,
    "paid_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firebase_uid" VARCHAR(128) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "phone" VARCHAR(20),
    "role" "users_role" NOT NULL DEFAULT 'BUYER',
    "avatar_url" TEXT,
    "address" TEXT,
    "state" VARCHAR(100),
    "city" VARCHAR(100),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" "verification_status" DEFAULT 'PENDING',
    "verification_document_url" TEXT,
    "verification_document_type" VARCHAR(100),
    "verification_notes" TEXT,
    "verified_at" TIMESTAMP(0),
    "verified_by_id" UUID,
    "bio" TEXT,
    "farm_name" VARCHAR(200),
    "farm_address" TEXT,
    "cac_number" VARCHAR(50),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loginAttempt" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),

    CONSTRAINT "loginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwordReset" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passwordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_animals_category" ON "animals"("category");

-- CreateIndex
CREATE INDEX "idx_animals_created_at" ON "animals"("created_at");

-- CreateIndex
CREATE INDEX "idx_animals_price" ON "animals"("price");

-- CreateIndex
CREATE INDEX "idx_animals_seller_id" ON "animals"("seller_id");

-- CreateIndex
CREATE INDEX "idx_animals_state" ON "animals"("state");

-- CreateIndex
CREATE INDEX "idx_animals_status" ON "animals"("status");

-- CreateIndex
CREATE INDEX "idx_cart_animal_id" ON "cart"("animal_id");

-- CreateIndex
CREATE INDEX "idx_cart_user_id" ON "cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_cart_user_animal" ON "cart"("user_id", "animal_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_animal_id" ON "inquiries"("animal_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_receiver_id" ON "inquiries"("receiver_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_sender_id" ON "inquiries"("sender_id");

-- CreateIndex
CREATE INDEX "idx_inquiries_status" ON "inquiries"("status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_orders_paystack_ref" ON "orders"("paystack_ref");

-- CreateIndex
CREATE INDEX "idx_orders_animal_id" ON "orders"("animal_id");

-- CreateIndex
CREATE INDEX "idx_orders_buyer_id" ON "orders"("buyer_id");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_reviews_animal_id" ON "reviews"("animal_id");

-- CreateIndex
CREATE INDEX "idx_reviews_rating" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "uq_reviews_user_animal" ON "reviews"("user_id", "animal_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_firebase_uid" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "idx_users_state" ON "users"("state");

-- CreateIndex
CREATE INDEX "idx_users_verification_status" ON "users"("verification_status");

-- CreateIndex
CREATE INDEX "idx_users_is_verified" ON "users"("is_verified");

-- CreateIndex
CREATE UNIQUE INDEX "LoginAttempt_email_key" ON "loginAttempt"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "passwordReset"("token");

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "fk_animals_seller" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_animal" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "fk_inquiries_animal" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "fk_inquiries_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "fk_inquiries_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_animal" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_buyer" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_animal" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

