<?php

namespace App\Filament\Resources\Expenses\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ExpenseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('category')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                DatePicker::make('date'),
            ]);
    }
}
