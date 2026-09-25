<?php

namespace App\Notifications;

use App\Models\Lot;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LotModerated extends Notification
{
    public function __construct(public Lot $lot) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = ['name' => "{$this->lot->brand_name} {$this->lot->product_name}"];

        if ($this->lot->status === Lot::STATUS_APPROVED) {
            return (new MailMessage)
                ->subject(__('Лот «:name» одобрен', $name))
                ->line(__('Лот прошёл проверку и уже виден покупателям в разделе «Розпив».'))
                ->action(__('Посмотреть лот'), route('lots.show', $this->lot));
        }

        return (new MailMessage)
            ->subject(__('Лот «:name» не прошёл проверку', $name))
            ->line(__('Причина: :reason', ['reason' => $this->lot->rejection_reason]))
            ->line(__('Исправьте лот и сохраните — он снова уйдёт на проверку.'))
            ->action(__('Исправить лот'), route('lots.edit', $this->lot));
    }
}
