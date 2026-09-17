<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $title = 'Галерея фото';

    // ponytail: same reason as VariantsRelationManager — lazy-load never fires headless.
    protected static bool $isLazy = false;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('image_path')
                    ->label('Фото (тёмная тема)')
                    ->image()
                    ->disk('public')
                    ->directory('products/gallery')
                    ->required(),
                FileUpload::make('image_path_light')
                    ->label('Фото (светлая тема)')
                    ->image()
                    ->disk('public')
                    ->directory('products/gallery')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('image_path')
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Тёмная тема')
                    ->disk('public')
                    ->square(),
                ImageColumn::make('image_path_light')
                    ->label('Светлая тема')
                    ->disk('public')
                    ->square(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
