<?php

$dir = __DIR__ . '/app/Filament/Resources';
$files = glob($dir . '/*/*Resource.php');

$translations = [
    'Product' => ['singular' => 'المنتج', 'plural' => 'المنتجات', 'icon' => 'heroicon-o-shopping-bag', 'group' => 'المتجر'],
    'Category' => ['singular' => 'القسم', 'plural' => 'الأقسام', 'icon' => 'heroicon-o-tag', 'group' => 'المتجر'],
    'Order' => ['singular' => 'الطلب', 'plural' => 'الطلبات', 'icon' => 'heroicon-o-shopping-cart', 'group' => 'المبيعات'],
    'OrderItem' => ['singular' => 'عنصر الطلب', 'plural' => 'عناصر الطلبات', 'icon' => 'heroicon-o-queue-list', 'group' => 'المبيعات'],
    'ReturnRequest' => ['singular' => 'طلب الاسترجاع', 'plural' => 'طلبات الاسترجاع', 'icon' => 'heroicon-o-arrow-path', 'group' => 'المبيعات'],
    'Customer' => ['singular' => 'العميل', 'plural' => 'العملاء', 'icon' => 'heroicon-o-users', 'group' => 'العملاء'],
    'User' => ['singular' => 'المستخدم', 'plural' => 'المستخدمين', 'icon' => 'heroicon-o-user', 'group' => 'الإدارة'],
    'Setting' => ['singular' => 'الإعداد', 'plural' => 'الإعدادات', 'icon' => 'heroicon-o-cog-6-tooth', 'group' => 'الإدارة'],
    'Supplier' => ['singular' => 'المورد', 'plural' => 'الموردين', 'icon' => 'heroicon-o-truck', 'group' => 'المالية'],
    'Expense' => ['singular' => 'المصروف', 'plural' => 'المصروفات', 'icon' => 'heroicon-o-currency-dollar', 'group' => 'المالية'],
    'Coupon' => ['singular' => 'كوبون الخصم', 'plural' => 'كوبونات الخصم', 'icon' => 'heroicon-o-ticket', 'group' => 'التسويق'],
    'Offer' => ['singular' => 'العرض', 'plural' => 'العروض', 'icon' => 'heroicon-o-sparkles', 'group' => 'التسويق'],
    'Testimonial' => ['singular' => 'رأي العميل', 'plural' => 'آراء العملاء', 'icon' => 'heroicon-o-star', 'group' => 'التسويق'],
    'Notification' => ['singular' => 'الإشعار', 'plural' => 'الإشعارات', 'icon' => 'heroicon-o-bell', 'group' => 'الإدارة'],
    'Booking' => ['singular' => 'الحجز', 'plural' => 'الحجوزات', 'icon' => 'heroicon-o-calendar', 'group' => 'المبيعات'],
    'ProductImage' => ['singular' => 'صورة المنتج', 'plural' => 'صور المنتجات', 'icon' => 'heroicon-o-photo', 'group' => 'المتجر'],
    'ProductVariant' => ['singular' => 'نوع المنتج', 'plural' => 'أنواع المنتجات', 'icon' => 'heroicon-o-swatch', 'group' => 'المتجر'],
];

foreach ($files as $file) {
    $content = file_get_contents($file);
    $basename = basename($file, 'Resource.php');

    if (isset($translations[$basename])) {
        $trans = $translations[$basename];
        
        // Remove existing icon if any
        $content = preg_replace('/protected static \?string \$navigationIcon = [^;]+;/', '', $content);
        
        $additions = "
    protected static ?string \$modelLabel = '{$trans['singular']}';
    protected static ?string \$pluralModelLabel = '{$trans['plural']}';
    protected static ?string \$navigationLabel = '{$trans['plural']}';
    protected static ?string \$navigationGroup = '{$trans['group']}';
    protected static ?string \$navigationIcon = '{$trans['icon']}';
";
        
        // insert after protected static ?string $model = ...
        if (strpos($content, '$modelLabel') === false) {
            $content = preg_replace('/(protected static \?string \$model = [^;]+;)/', "$1\n$additions", $content);
            file_put_contents($file, $content);
            echo "Updated $basename\n";
        }
    }
}
