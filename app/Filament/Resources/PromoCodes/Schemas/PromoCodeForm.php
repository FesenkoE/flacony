<?php

namespace App\Filament\Resources\PromoCodes\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PromoCodeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(64),
                Select::make('type')
                    ->options([
                        'percent' => 'Процент',
                        'fixed' => 'Фиксированная сумма',
                    ])
                    ->required()
                    ->native(false),
                TextInput::make('value')
                    ->label('Размер скидки')
                    ->numeric()
                    ->required(),
                TextInput::make('min_order_amount')
                    ->label('Минимальная сумма заказа')
                    ->numeric(),
                TextInput::make('max_uses')
                    ->label('Лимит использований')
                    ->numeric()
                    ->helperText('Пусто — без лимита'),
                DateTimePicker::make('expires_at')
                    ->label('Действует до')
                    ->native(false),
                Toggle::make('active')
                    ->default(true),
            ]);
    }
}
