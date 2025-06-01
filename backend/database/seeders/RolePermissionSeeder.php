<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tạo roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'api']);

        // Tạo user admin đầu tiên
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'fullName' => 'Tâm Admin',
                'password' => Hash::make('123123'),
                'status' => 1,
                'is_verify' => 1,
            ]
        );
        $admin->assignRole($adminRole);

        // Nhập mảng permission tại đây:

        $permissions2 = [
            'create-role',
            'update-role',
            'delete-role',
            'create-permission',
            'update-permission',
            'delete-customer',
            'update-customer',
            'create-category',
            'delete-category',
            'update-category',
            'create-category-news',
            'delete-category-news',
            'update-category-news',
            'create-product',
            'delete-product',
            'update-product',
            'update-news',
            'create-news',
            'delete-news',
            'create-banner',
            'update-banner',
            'delete-banner',
            'update-voucher',
            'create-voucher',
            'delete-voucher',
            'update-order',
            'create-order',
            'delete-order',
            'delete-permission',
            'view-comment-product',
            'delete-comment-product',
            'view-comment-news',
            'delete-comment-news',
            'create-customer'
        ]; 

        // Tạo permission và gán cho Admin
        foreach ($permissions2 as $permission) {
            $perm = Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api'
            ]);
            $perm->assignRole($adminRole);
        }

        // Users không cần permission mặc định
    }
}