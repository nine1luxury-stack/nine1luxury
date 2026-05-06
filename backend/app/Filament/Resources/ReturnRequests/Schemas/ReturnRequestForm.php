<?php

namespace App\Filament\Resources\ReturnRequests\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ReturnRequestForm
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
                    ->numeric(),
                TextInput::make('type')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('PENDING'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
