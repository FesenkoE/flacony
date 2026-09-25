<?php

namespace App\Filament\Resources\Orders;

use App\Models\Order;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;

// Status buttons shared by the orders table and the order view page.
class OrderStatusActions
{
    /**
     * @return array<int, Action>
     */
    public static function make(): array
    {
        return [
            Action::make('confirm')
                ->label('Подтвердить')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn (Order $record) => $record->canTransitionTo(Order::STATUS_CONFIRMED))
                ->action(fn (Order $record) => $record->transitionTo(Order::STATUS_CONFIRMED)),
            Action::make('ship')
                ->label('Отправлен')
                ->icon('heroicon-o-truck')
                ->color('info')
                ->visible(fn (Order $record) => $record->canTransitionTo(Order::STATUS_SHIPPED))
                ->schema([
                    TextInput::make('tracking_number')
                        ->label('ТТН Новой Почты')
                        ->helperText('Необязательно для курьера по городу и самовывоза. Покупатель получит ссылку на отслеживание.'),
                ])
                ->action(fn (Order $record, array $data) => $record->transitionTo(
                    Order::STATUS_SHIPPED,
                    filled($data['tracking_number'] ?? null) ? trim($data['tracking_number']) : null,
                )),
            Action::make('deliver')
                ->label('Доставлен')
                ->icon('heroicon-o-home')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn (Order $record) => $record->canTransitionTo(Order::STATUS_DELIVERED))
                ->action(fn (Order $record) => $record->transitionTo(Order::STATUS_DELIVERED)),
            Action::make('cancel')
                ->label('Отменить заказ')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->modalSubmitActionLabel('Отменить заказ')
                ->modalCancelActionLabel('Назад')
                ->modalDescription('Мл из лотов распива вернутся продавцам, покупатель получит письмо об отмене.')
                ->visible(fn (Order $record) => $record->canTransitionTo(Order::STATUS_CANCELLED))
                ->action(fn (Order $record) => $record->transitionTo(Order::STATUS_CANCELLED)),
        ];
    }

    public static function color(string $status): string
    {
        return match ($status) {
            Order::STATUS_NEW => 'warning',
            Order::STATUS_CONFIRMED, Order::STATUS_SHIPPED => 'info',
            Order::STATUS_DELIVERED => 'success',
            default => 'danger',
        };
    }
}
