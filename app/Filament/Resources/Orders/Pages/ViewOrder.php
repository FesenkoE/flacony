<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\Orders\OrderStatusActions;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    public function getTitle(): string
    {
        return "Заказ №{$this->record->id}";
    }

    protected function getHeaderActions(): array
    {
        return OrderStatusActions::make();
    }
}
