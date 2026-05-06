<?php

namespace App\Filament\Resources\Suppliers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SupplierForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('manualTotalPurchases')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('manualTotalPaid')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
