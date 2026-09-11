<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';

    protected static ?string $title = 'Объёмы';

    // ponytail: lazy-loads via an intersection observer by default, which never
    // fires in a headless/offscreen render — eager loading a handful of variant
    // rows costs nothing on an admin-only page, so just skip the indirection.
    protected static bool $isLazy = false;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('volume_ml')
                    ->label('Объём, мл')
                    ->numeric()
                    ->required(),
                TextInput::make('price')
                    ->label('Цена, ₴')
                    ->numeric()
                    ->required(),
                TextInput::make('sku')
                    ->label('Артикул'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('volume_ml')
            ->columns([
                TextColumn::make('volume_ml')
                    ->label('Объём, мл')
                    ->sortable(),
                TextColumn::make('price')
                    ->label('Цена, ₴')
                    ->sortable(),
                TextColumn::make('sku')
                    ->label('Артикул'),
            ])
            ->defaultSort('volume_ml')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
