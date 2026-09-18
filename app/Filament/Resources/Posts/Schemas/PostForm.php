<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('author_id')
                    ->relationship('author', 'name'),
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('excerpt')
                    ->columnSpanFull(),
                Textarea::make('body')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('cover_path')
                    ->label('Обложка (тёмная тема)')
                    ->image()
                    ->disk('public')
                    ->directory('posts'),
                FileUpload::make('cover_path_light')
                    ->label('Обложка (светлая тема)')
                    ->helperText('Можно добавить позже.')
                    ->image()
                    ->disk('public')
                    ->directory('posts'),
                DateTimePicker::make('published_at'),
            ]);
    }
}
