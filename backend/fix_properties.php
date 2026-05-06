<?php
$files = glob(__DIR__ . '/app/Filament/Resources/*/*Resource.php');
foreach ($files as $f) {
    $content = file_get_contents($f);
    
    // Extract the values from the properties
    preg_match('/protected static \?string \$modelLabel = \'([^\']+)\';/', $content, $modelMatch);
    preg_match('/protected static \?string \$pluralModelLabel = \'([^\']+)\';/', $content, $pluralMatch);
    preg_match('/protected static \?string \$navigationLabel = \'([^\']+)\';/', $content, $navMatch);
    preg_match('/protected static \?string \$navigationGroup = \'([^\']+)\';/', $content, $groupMatch);
    preg_match('/protected static \?string \$navigationIcon = \'([^\']+)\';/', $content, $iconMatch);
    
    if ($modelMatch) {
        $model = $modelMatch[1];
        $plural = $pluralMatch[1];
        $nav = $navMatch[1];
        $group = $groupMatch[1];
        $icon = $iconMatch[1];
        
        // Remove properties
        $content = preg_replace('/protected static \?string \$modelLabel = [^;]+;\s+/', '', $content);
        $content = preg_replace('/protected static \?string \$pluralModelLabel = [^;]+;\s+/', '', $content);
        $content = preg_replace('/protected static \?string \$navigationLabel = [^;]+;\s+/', '', $content);
        $content = preg_replace('/protected static \?string \$navigationGroup = [^;]+;\s+/', '', $content);
        $content = preg_replace('/protected static \?string \$navigationIcon = [^;]+;\s+/', '', $content);
        
        // Add methods after protected static ?string $model = ...
        $methods = "
    public static function getModelLabel(): string { return '$model'; }
    public static function getPluralModelLabel(): string { return '$plural'; }
    public static function getNavigationLabel(): string { return '$nav'; }
    public static function getNavigationGroup(): ?string { return '$group'; }
    public static function getNavigationIcon(): string|\BackedEnum|null { return '$icon'; }
";
        $content = preg_replace('/(protected static \?string \$model = [^;]+;)/', "$1\n$methods", $content);
        
        file_put_contents($f, $content);
        echo "Fixed methods in " . basename($f) . "\n";
    }
}
