<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
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
                    ->helperText('Можно добавить позже.')
                    ->image()
                    ->disk('public')
                    ->directory('products/gallery'),
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
                Action::make('bulkUploadDark')
                    ->label('Загрузить фото (тёмная тема)')
                    ->form([
                        FileUpload::make('images')
                            ->label('Фото')
                            ->helperText('Можно выбрать сразу несколько — каждое создаст свою строку. Светлую версию добавите отдельной загрузкой позже.')
                            ->image()
                            ->multiple()
                            ->required()
                            ->disk('public')
                            ->directory('products/gallery'),
                    ])
                    ->action(function (array $data): void {
                        $nextOrder = $this->getOwnerRecord()->images()->max('sort_order') + 1;

                        foreach ($data['images'] as $i => $path) {
                            $this->getOwnerRecord()->images()->create([
                                'image_path' => $path,
                                'sort_order' => $nextOrder + $i,
                            ]);
                        }
                    }),
                Action::make('bulkUploadLight')
                    ->label('Загрузить фото (светлая тема)')
                    ->color('gray')
                    ->form([
                        FileUpload::make('images')
                            ->label('Фото')
                            ->helperText('Файлы применятся по порядку к уже существующим строкам без светлой версии (сверху вниз, по текущей сортировке).')
                            ->image()
                            ->multiple()
                            ->required()
                            ->disk('public')
                            ->directory('products/gallery'),
                    ])
                    ->action(function (array $data): void {
                        $rows = $this->getOwnerRecord()->images()
                            ->whereNull('image_path_light')
                            ->orderBy('sort_order')
                            ->get();

                        $paths = array_values($data['images']);

                        foreach ($paths as $i => $path) {
                            if (! isset($rows[$i])) {
                                break;
                            }

                            $rows[$i]->update(['image_path_light' => $path]);
                        }

                        if (count($paths) !== $rows->count()) {
                            Notification::make()
                                ->warning()
                                ->title('Количество файлов не совпало со строками без светлой версии')
                                ->body("Строк без светлой версии: {$rows->count()}, загружено файлов: " . count($paths) . '. Заполнены по порядку, лишнее не применено.')
                                ->send();
                        }
                    }),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
