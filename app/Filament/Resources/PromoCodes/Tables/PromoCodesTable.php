<?php

namespace App\Filament\Resources\PromoCodes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PromoCodesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->searchable()
                    ->fontFamily('mono')
                    ->weight('bold'),
                TextColumn::make('type')
                    ->formatStateUsing(fn (string $state) => $state === 'percent' ? 'Процент' : 'Сумма'),
                TextColumn::make('value')
                    ->label('Скидка')
                    ->formatStateUsing(fn ($record) => $record->type === 'percent'
                        ? "{$record->value}%"
                        : "{$record->value} ₴"),
                TextColumn::make('used_count')
                    ->label('Использовано')
                    ->formatStateUsing(fn ($record) => $record->max_uses
                        ? "{$record->used_count} / {$record->max_uses}"
                        : (string) $record->used_count),
                TextColumn::make('expires_at')
                    ->label('Действует до')
                    ->dateTime()
                    ->placeholder('без срока'),
                IconColumn::make('active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
