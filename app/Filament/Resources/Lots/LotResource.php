<?php

namespace App\Filament\Resources\Lots;

use App\Filament\Resources\Lots\Pages\EditLot;
use App\Filament\Resources\Lots\Pages\ListLots;
use App\Filament\Resources\Lots\Schemas\LotForm;
use App\Filament\Resources\Lots\Tables\LotsTable;
use App\Models\Lot;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LotResource extends Resource
{
    protected static ?string $model = Lot::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static ?string $navigationLabel = 'Лоты распива';

    protected static ?string $modelLabel = 'Лот';

    protected static ?string $pluralModelLabel = 'Лоты распива';

    protected static bool $hasTitleCaseModelLabel = false;

    public static function form(Schema $schema): Schema
    {
        return LotForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LotsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLots::route('/'),
            'edit' => EditLot::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $pending = static::getModel()::where('status', Lot::STATUS_PENDING)->count();

        return $pending > 0 ? (string) $pending : null;
    }
}
