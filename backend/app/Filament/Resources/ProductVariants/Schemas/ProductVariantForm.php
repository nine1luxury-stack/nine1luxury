<?php

namespace App\Filament\Resources\ProductVariants\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ProductVariantForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('color')
                    ->required(),
                TextInput::make('colorHex'),
                TextInput::make('size')
                    ->required(),
                TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('damagedStock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('washStock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('repackageStock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('sku')
                    ->label('SKU'),
            ]);
    }
}
