<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Filament\Resources\Orders\OrderStatusActions;
use App\Models\Order;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('№')
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Покупатель')
                    ->description(fn (Order $record) => $record->phone)
                    ->searchable(['name', 'phone', 'email']),
                TextColumn::make('seller.name')
                    ->label('Отправитель')
                    ->placeholder('Flacony'),
                TextColumn::make('city')
                    ->label('Город'),
                TextColumn::make('total')
                    ->label('Сумма')
                    ->money('UAH')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->color(fn (string $state) => OrderStatusActions::color($state))
                    ->formatStateUsing(fn (string $state) => Order::STATUS_LABELS[$state] ?? $state),
                TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Статус')
                    ->options(Order::STATUS_LABELS),
                TernaryFilter::make('seller_id')
                    ->label('Отправитель')
                    ->nullable()
                    ->trueLabel('Продавцы распива')
                    ->falseLabel('Flacony'),
            ])
            ->recordActions([
                ...OrderStatusActions::make(),
                ViewAction::make(),
            ]);
    }
}
