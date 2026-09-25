<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewSale extends Notification
{
    public function __construct(public Order $order) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject(__('Новая продажа: заказ №:id', ['id' => $this->order->id]))
            ->line(__('Покупатель заказал ваш распив:'));

        foreach ($this->order->items as $item) {
            $mail->line("{$item->brand_name} {$item->product_name} — {$item->detail}");
        }

        return $mail
            ->line(__('Подтвердите заказ и отправьте его Новой Почтой — адрес и телефон покупателя на странице заказа.'))
            ->action(__('Открыть заказ'), route('orders.show', $this->order));
    }
}
