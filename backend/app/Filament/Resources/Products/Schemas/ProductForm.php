<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('model'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                TextInput::make('discount')
                    ->numeric(),
                TextInput::make('category'),
                Toggle::make('featured')
                    ->required(),
                Toggle::make('isActive')
                    ->required(),
                TextInput::make('reorderPoint')
                    ->required()
                    ->numeric()
                    ->default(10),
                TextInput::make('sizeChartImage'),
            ]);
    }
}
