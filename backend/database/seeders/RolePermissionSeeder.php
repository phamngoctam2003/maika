<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Danh sách quyền
        $permissions = [
            'create category',
            'edit category',
            'delete category',
            'view users',
            'edit users',
            'delete users',
        ];

        // Tạo quyền nếu chưa tồn tại
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                [
                    'name' => $permission,
                    'guard_name' => 'api' // Đảm bảo tất cả quyền có cùng guard_name
                ]
            );
        }

        // Tạo vai trò và gán quyền
        $superRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'api']);
        $superRole->givePermissionTo($permissions); // SuperAdmin có tất cả quyền

        $editorRole = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'api']);
        $editorRole->givePermissionTo(['create category', 'edit category']);

        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'api']);
    }
}
