<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->numeric(),
                TextInput::make('guestName'),
                TextInput::make('guestPhone'),
                TextInput::make('guestAddress'),
                TextInput::make('guestCity'),
                TextInput::make('totalAmount')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->default('PENDING'),
                TextInput::make('paymentMethod'),
                TextInput::make('depositAmount')
                    ->numeric(),
            ]);
    }
}
