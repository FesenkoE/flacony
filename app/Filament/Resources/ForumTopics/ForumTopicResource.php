<?php

namespace App\Filament\Resources\ForumTopics;

use App\Filament\Resources\ForumTopics\Pages\ListForumTopics;
use App\Filament\Resources\ForumTopics\Pages\ViewForumTopic;
use App\Filament\Resources\ForumTopics\RelationManagers\RepliesRelationManager;
use App\Models\ForumTopic;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

// Moderation only: topics come from the site, the admin reads and deletes.
class ForumTopicResource extends Resource
{
    protected static ?string $model = ForumTopic::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static ?string $navigationLabel = 'Форум';

    protected static ?string $modelLabel = 'Тема форума';

    protected static ?string $pluralModelLabel = 'Темы форума';

    protected static bool $hasTitleCaseModelLabel = false;

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                TextEntry::make('category.name')->label('Раздел'),
                TextEntry::make('author.name')->label('Автор'),
                TextEntry::make('created_at')->label('Создана')->dateTime('d.m.Y H:i'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // Fresh answers first — that's where new spam shows up.
            ->modifyQueryUsing(fn (Builder $query) => $query->withMax('replies', 'created_at'))
            ->columns([
                TextColumn::make('title')
                    ->label('Тема')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('category.name')
                    ->label('Раздел'),
                TextColumn::make('author.name')
                    ->label('Автор')
                    ->searchable(),
                TextColumn::make('replies_count')
                    ->label('Сообщений')
                    ->counts('replies'),
                TextColumn::make('replies_max_created_at')
                    ->label('Последнее сообщение')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('replies_max_created_at', 'desc')
            ->filters([
                SelectFilter::make('forum_category_id')
                    ->label('Раздел')
                    ->relationship('category', 'name'),
            ])
            ->recordActions([
                ViewAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getRelations(): array
    {
        return [
            RepliesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListForumTopics::route('/'),
            'view' => ViewForumTopic::route('/{record}'),
        ];
    }
}
