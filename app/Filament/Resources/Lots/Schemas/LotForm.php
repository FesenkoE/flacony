<?php

namespace App\Filament\Resources\Lots\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LotForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Лот')
                    ->columns(2)
                    ->schema([
                        Select::make('user_id')
                            ->relationship('seller', 'name')
                            ->disabled(),
                        TextInput::make('brand_name')
                            ->disabled(),
                        TextInput::make('product_name')
                            ->disabled(),
                        Select::make('product_id')
                            ->label('Товар каталога')
                            ->relationship('product', 'name', fn ($query) => $query->with('brand'))
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->brand->name} — {$record->name}")
                            ->searchable(['name'])
                            ->preload()
                            ->helperText('На витрине показывается фото этого товара. Подставляется сам, если бренд и название совпали с каталогом.')
                            ->columnSpanFull(),
                        TextInput::make('total_volume_ml')
                            ->numeric()
                            ->disabled(),
                        TextInput::make('remaining_volume_ml')
                            ->numeric()
                            ->disabled(),
                        TextInput::make('price_per_ml')
                            ->numeric()
                            ->disabled(),
                        FileUpload::make('photo_sprayer_path')
                            ->label('Фото флакона')
                            ->image()
                            ->disk('public')
                            ->directory('lots')
                            ->disabled(),
                        FileUpload::make('photo_batch_code_path')
                            ->label('Фото батч-кода')
                            ->image()
                            ->disk('public')
                            ->directory('lots')
                            ->disabled(),
                        Textarea::make('description')
                            ->label('Комментарий продавца')
                            ->disabled()
                            ->columnSpanFull(),
                    ]),

                Section::make('Модерация')
                    ->columns(2)
                    ->schema([
                        Select::make('status')
                            ->options([
                                'pending' => 'На модерации',
                                'approved' => 'Одобрен',
                                'rejected' => 'Отклонён',
                            ])
                            ->required(),
                        Textarea::make('rejection_reason')
                            ->label('Причина отклонения')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
