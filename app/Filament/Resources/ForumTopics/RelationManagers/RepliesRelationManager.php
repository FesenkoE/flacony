<?php

namespace App\Filament\Resources\ForumTopics\RelationManagers;

use App\Models\ForumReply;
use Filament\Actions\DeleteAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RepliesRelationManager extends RelationManager
{
    protected static string $relationship = 'replies';

    protected static ?string $title = 'Сообщения';

    // Same reason as VariantsRelationManager: lazy loading never fires offscreen.
    protected static bool $isLazy = false;

    // Relation managers on a View page are read-only by default; moderation needs delete.
    public function isReadOnly(): bool
    {
        return false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('author.name')
                    ->label('Автор'),
                TextColumn::make('body')
                    ->label('Текст')
                    ->wrap(),
                TextColumn::make('created_at')
                    ->label('Дата')
                    ->dateTime('d.m.Y H:i'),
            ])
            ->defaultSort('created_at')
            ->paginated(false)
            ->recordActions([
                // The opening message is the topic itself — delete the whole topic instead.
                DeleteAction::make()
                    ->hidden(fn (ForumReply $record) => $record->id === $this->getOwnerRecord()->replies()->oldest()->value('id')),
            ]);
    }
}
