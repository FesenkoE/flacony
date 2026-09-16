<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Основное')
                    ->columns(2)
                    ->schema([
                        Select::make('brand_id')
                            ->relationship('brand', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true),
                        Toggle::make('is_active')
                            ->default(true)
                            ->required(),
                        FileUpload::make('image_path')
                            ->label('Фото (тёмная тема)')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->required()
                            ->columnSpanFull(),
                        FileUpload::make('image_path_light')
                            ->label('Фото (светлая тема)')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->required()
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->columnSpanFull(),
                    ]),

                Section::make('Профиль аромата')
                    ->columns(2)
                    ->schema([
                        TextInput::make('perfumer'),
                        TextInput::make('release_year')
                            ->numeric()
                            ->minValue(1900)
                            ->maxValue((int) date('Y')),
                        TextInput::make('concentration')
                            ->placeholder('EDT, EDP, Parfum...'),
                        Select::make('longevity')
                            ->options([
                                'weak' => 'Слабая',
                                'moderate' => 'Умеренная',
                                'long_lasting' => 'Стойкая',
                                'eternal' => 'Очень стойкая',
                            ]),
                        Select::make('sillage')
                            ->options([
                                'soft' => 'Лёгкий',
                                'moderate' => 'Умеренный',
                                'strong' => 'Сильный',
                                'enormous' => 'Огромный',
                            ]),
                        TagsInput::make('top_notes')
                            ->label('Верхние ноты')
                            ->columnSpanFull(),
                        TagsInput::make('heart_notes')
                            ->label('Средние ноты')
                            ->columnSpanFull(),
                        TagsInput::make('base_notes')
                            ->label('Базовые ноты')
                            ->columnSpanFull(),
                        Repeater::make('accords')
                            ->label('Аккорды')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Название')
                                    ->required(),
                                TextInput::make('percent')
                                    ->label('%')
                                    ->numeric()
                                    ->minValue(0)
                                    ->maxValue(100)
                                    ->required(),
                            ])
                            ->columns(2)
                            ->columnSpanFull()
                            ->addActionLabel('Добавить аккорд')
                            ->reorderable(false),
                    ]),
            ]);
    }
}
