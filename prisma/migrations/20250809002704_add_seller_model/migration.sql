/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,category,month,year]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sale_sellerId_category_month_year_key" ON "public"."Sale"("sellerId", "category", "month", "year");
