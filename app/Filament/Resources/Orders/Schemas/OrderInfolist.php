<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Filament\Resources\Orders\OrderStatusActions;
use App\Http\Controllers\CheckoutController;
use App\Models\Order;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

// Shopify-style order page: items and totals in the wide column,
// customer and delivery in the narrow sidebar.
class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make([
                    Section::make('Состав')
                        ->schema([
                            RepeatableEntry::make('items')
                                ->hiddenLabel()
                                ->contained(false)
                                ->columns(4)
                                ->schema([
                                    TextEntry::make('product_name')
                                        ->hiddenLabel()
                                        ->formatStateUsing(fn ($state, $record) => "{$record->brand_name} — {$state}")
                                        ->weight('semibold')
                                        ->columnSpan(2),
                                    TextEntry::make('detail')
                                        ->hiddenLabel()
                                        ->color('gray'),
                                    TextEntry::make('subtotal')
                                        ->hiddenLabel()
                                        ->money('UAH')
                                        ->alignEnd(),
                                ]),
                            TextEntry::make('discount_amount')
                                ->label(fn (Order $record) => "Скидка по промокоду {$record->promo_code}")
                                ->inlineLabel()
                                ->money('UAH')
                                ->alignEnd()
                                ->visible(fn (Order $record) => $record->discount_amount > 0),
                            TextEntry::make('total')
                                ->label('Итого')
                                ->inlineLabel()
                                ->money('UAH')
                                ->alignEnd()
                                ->weight('bold'),
                        ]),
                    Section::make('Статус')
                        ->columns(3)
                        ->schema([
                            TextEntry::make('status')
                                ->label('Статус')
                                ->badge()
                                ->color(fn (string $state) => OrderStatusActions::color($state))
                                ->formatStateUsing(fn (string $state) => Order::STATUS_LABELS[$state] ?? $state),
                            TextEntry::make('created_at')
                                ->label('Создан')
                                ->dateTime('d.m.Y H:i'),
                            TextEntry::make('tracking_number')
                                ->label('ТТН')
                                ->placeholder('—')
                                ->copyable(),
                        ]),
                ])->columnSpan(2),
                Group::make([
                    Section::make('Покупатель')
                        ->schema([
                            TextEntry::make('name')->hiddenLabel()->weight('semibold'),
                            TextEntry::make('phone')->hiddenLabel()->copyable(),
                            TextEntry::make('email')->hiddenLabel()->copyable(),
                        ]),
                    Section::make('Доставка и оплата')
                        ->schema([
                            TextEntry::make('delivery_method')
                                ->label('Доставка')
                                ->placeholder('—')
                                ->formatStateUsing(fn (string $state) => CheckoutController::deliveryMethods()[$state] ?? $state),
                            TextEntry::make('address')
                                ->label('Адрес / отделение')
                                ->formatStateUsing(fn ($state, Order $record) => "{$record->city}, {$state}"),
                            TextEntry::make('payment_method')
                                ->label('Оплата')
                                ->placeholder('—')
                                ->formatStateUsing(fn (string $state) => CheckoutController::paymentMethods()[$state] ?? $state),
                            TextEntry::make('comment')
                                ->label('Комментарий покупателя')
                                ->visible(fn (Order $record) => filled($record->comment)),
                        ]),
                ])->columnSpan(1),
            ]);
    }
}
