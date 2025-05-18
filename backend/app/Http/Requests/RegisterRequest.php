<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Điều chỉnh nếu cần phân quyền
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'required|string|size:10',
        ];
    }

    public function messages(): array
    {
        return [
            'fullName.required' => 'Họ và tên không được để trống',
            'fullName.string' => 'Họ và tên phải là chuỗi',
            'fullName.max' => 'Họ và tên không được quá 255 ký tự',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu không được để trống',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'phone.required' => 'Số điện thoại không được để trống',
            'phone.string' => 'Số điện thoại phải là chuỗi',
            'phone.size' => 'Số điện thoại phải có đúng 10 chữ số',
        ];
    }
}
