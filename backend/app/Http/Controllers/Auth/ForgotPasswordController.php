<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $messages = [
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Vui lòng nhập đúng định dạng email.',
            'email.exists' => 'Email không tồn tại.',

        ];
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], $messages);

        $status = Password::sendResetLink($request->only('email'));

        // Thông báo tiếng Việt
        $messages = [
            Password::RESET_LINK_SENT => 'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.',
            Password::INVALID_USER => 'Không tìm thấy người dùng với email này.',
        ];

        $message = $messages[$status] ?? __($status);

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => $message], 200)
            : response()->json(['message' => "Vui lòng kiểm tra hòm thư rồi thử lại!"], 400);
    }
}
