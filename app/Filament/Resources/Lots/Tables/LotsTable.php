<?php

namespace App\Filament\Resources\Lots\Tables;

use App\Models\Lot;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LotsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo_sprayer_path')
                    ->label('Флакон')
                    ->disk('public')
                    ->square(),
                ImageColumn::make('photo_batch_code_path')
                    ->label('Батч-код')
                    ->disk('public')
                    ->square(),
                TextColumn::make('seller.name')
                    ->label('Продавец')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('brand_name')
                    ->label('Бренд')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('product_name')
                    ->label('Название')
                    ->searchable(),
                TextColumn::make('remaining_volume_ml')
                    ->label('Остаток, мл')
                    ->numeric(),
                TextColumn::make('price_per_ml')
                    ->label('Цена/мл')
                    ->money('UAH'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Lot::STATUS_APPROVED => 'success',
                        Lot::STATUS_REJECTED => 'danger',
                        default => 'warning',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        Lot::STATUS_APPROVED => 'Одобрен',
                        Lot::STATUS_REJECTED => 'Отклонён',
                        default => 'На модерации',
                    })
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        Lot::STATUS_PENDING => 'На модерации',
                        Lot::STATUS_APPROVED => 'Одобрен',
                        Lot::STATUS_REJECTED => 'Отклонён',
                    ]),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Одобрить')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Lot $record) => $record->status !== Lot::STATUS_APPROVED)
                    ->action(fn (Lot $record) => $record->update([
                        'status' => Lot::STATUS_APPROVED,
                        'rejection_reason' => null,
                    ])),
                Action::make('reject')
                    ->label('Отклонить')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Lot $record) => $record->status !== Lot::STATUS_REJECTED)
                    ->schema([
                        Textarea::make('rejection_reason')
                            ->label('Причина отклонения')
                            ->required(),
                    ])
                    ->action(fn (Lot $record, array $data) => $record->update([
                        'status' => Lot::STATUS_REJECTED,
                        'rejection_reason' => $data['rejection_reason'],
                    ])),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
