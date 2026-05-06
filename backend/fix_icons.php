<?php
$files = glob(__DIR__ . '/app/Filament/Resources/*/*Resource.php');
foreach ($files as $f) {
    $content = file_get_contents($f);
    $content = preg_replace('/protected static string\|BackedEnum\|null \$navigationIcon = [^;]+;/', '', $content);
    file_put_contents($f, $content);
    echo "Fixed " . basename($f) . "\n";
}
