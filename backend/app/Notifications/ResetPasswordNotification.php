<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;
    public $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $frontendUrl = env('APP_FRONTEND_URL');
        $resetLink = $frontendUrl . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Yêu cầu đặt lại mật khẩu')
            ->greeting('Xin chào bạn!') // Tắt Hello
            ->line('Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.')
            ->action('Đặt lại mật khẩu', $resetLink)
            ->line("Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. \nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi.")
            ->salutation("Trân trọng,\nMaika");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
