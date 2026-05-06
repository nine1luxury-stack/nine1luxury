<?php

namespace App\Filament\Resources\Bookings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                TextInput::make('city'),
                TextInput::make('shippingAmount')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('productModel'),
                TextInput::make('productSize'),
                TextInput::make('type')
                    ->required()
                    ->default('RESERVATION'),
                TextInput::make('status')
                    ->required()
                    ->default('PENDING'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
