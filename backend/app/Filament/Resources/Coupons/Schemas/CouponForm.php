<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required(),
                TextInput::make('type')
                    ->required()
                    ->default('PERCENTAGE'),
                TextInput::make('value')
                    ->required()
                    ->numeric(),
                TextInput::make('minQuantity')
                    ->required()
                    ->numeric()
                    ->default(1),
                Toggle::make('isActive')
                    ->required(),
                TextInput::make('usedCount')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
