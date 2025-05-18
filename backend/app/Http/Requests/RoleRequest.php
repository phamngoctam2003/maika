<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:roles',
            'guard_name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Tên không được để trống',
            'name.string' => 'Tên phải là chuỗi',
            'name.max' => 'Tên không được quá 255 ký tự',
            'name.unique' => 'Tên đã tồn tại',
            'guard_name.required' => 'Guard name không được để trống',
            'guard_name.string' => 'Guard name phải là chuỗi',
            'guard_name.max' => 'Guard name không được quá 255 ký tự',
            'permissions.array' => 'Permissions phải là mảng',
            'permissions.*.exists' => 'Permission không tồn tại',
        ];
    }
}
