<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
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
        $order = $this->order;
        $id = ['id' => $order->id];

        [$subject, $line] = match ($order->status) {
            Order::STATUS_CONFIRMED => ['Заказ №:id подтверждён', 'Собираем заказ — напишем, когда отправим.'],
            Order::STATUS_SHIPPED => ['Заказ №:id отправлен', 'Заказ уже в пути.'],
            Order::STATUS_CANCELLED => ['Заказ №:id отменён', 'Если это ошибка или остались вопросы — просто ответьте на это письмо.'],
            default => ['Заказ №:id принят', 'Спасибо! Мы получили заказ и скоро свяжемся, чтобы его подтвердить.'],
        };

        $mail = (new MailMessage)
            ->subject(__($subject, $id))
            ->line(__($line));

        // A split cart means several orders — say who ships this one.
        if ($order->seller) {
            $mail->line(__('Отправитель: :name (распив)', ['name' => $order->seller->name]));
        }

        $mail
            ->line(__('Сумма: :total ₴', ['total' => number_format((float) $order->total, 2, '.', ' ')]));

        // MailMessage has a single button: tracking beats "view order" once shipped.
        if ($order->status === Order::STATUS_SHIPPED && $order->tracking_number) {
            return $mail
                ->line(__('Номер ТТН Новой Почты: :ttn', ['ttn' => $order->tracking_number]))
                ->action(__('Отследить посылку'), 'https://tracking.novaposhta.ua/#/uk/'.rawurlencode($order->tracking_number));
        }

        return $mail->action(__('Посмотреть заказ'), $order->viewUrl());
    }
}
