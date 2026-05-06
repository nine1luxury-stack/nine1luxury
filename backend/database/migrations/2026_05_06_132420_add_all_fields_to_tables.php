<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('name')->unique();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('name');
            $table->string('model')->nullable();
            $table->text('description')->nullable();
            $table->double('price')->default(0);
            $table->double('discount')->nullable();
            $table->string('category')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('isActive')->default(true);
            $table->integer('reorderPoint')->default(10);
            $table->string('sizeChartImage')->nullable();
        });

        Schema::table('product_images', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('url');
            $table->string('color')->nullable();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('color');
            $table->string('colorHex')->nullable();
            $table->string('size');
            $table->integer('stock')->default(0);
            $table->integer('damagedStock')->default(0);
            $table->integer('washStock')->default(0);
            $table->integer('repackageStock')->default(0);
            $table->string('sku')->nullable();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('guestName')->nullable();
            $table->string('guestPhone')->nullable();
            $table->string('guestAddress')->nullable();
            $table->string('guestCity')->nullable();
            $table->double('totalAmount')->default(0);
            $table->string('status')->default('PENDING');
            $table->string('paymentMethod')->nullable();
            $table->double('depositAmount')->nullable();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->integer('quantity')->default(1);
            $table->double('price')->default(0);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->nullable();
            $table->boolean('read')->default(false);
        });

        Schema::table('return_requests', function (Blueprint $table) {
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->integer('quantity');
            $table->string('type');
            $table->string('status')->default('PENDING');
            $table->text('notes')->nullable();
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('description')->nullable();
            $table->double('manualTotalPurchases')->default(0);
            $table->double('manualTotalPaid')->default(0);
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->double('amount');
            $table->string('category');
            $table->text('description')->nullable();
            $table->date('date')->nullable();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('name');
            $table->string('phone')->unique();
            $table->integer('totalOrders')->default(0);
            $table->double('totalSpent')->default(0);
            $table->timestamp('lastOrderDate')->nullable();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('name');
            $table->string('phone');
            $table->string('city')->nullable();
            $table->double('shippingAmount')->default(0);
            $table->string('productModel')->nullable();
            $table->string('productSize')->nullable();
            $table->string('type')->default('RESERVATION');
            $table->string('status')->default('PENDING');
            $table->text('notes')->nullable();
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->string('key')->unique();
            $table->text('value')->nullable();
        });

        Schema::table('coupons', function (Blueprint $table) {
            $table->string('code')->unique();
            $table->string('type')->default('PERCENTAGE');
            $table->double('value');
            $table->integer('minQuantity')->default(1);
            $table->boolean('isActive')->default(true);
            $table->integer('usedCount')->default(0);
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('imageUrl')->nullable();
            $table->string('link')->nullable();
            $table->boolean('isActive')->default(true);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->string('name');
            $table->string('role')->default('عميل');
            $table->text('content');
            $table->integer('rating')->default(5);
            $table->boolean('isActive')->default(true);
        });
    }

    public function down(): void
    {
        // down logic
    }
};
