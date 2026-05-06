<?php

namespace App\Filament\Resources\OrderItems\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_variant_id')
                    ->numeric(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
            ]);
    }
}
