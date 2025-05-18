<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            [
                'email' => 'superadmin@gmail.com',
            ],
            [
                'fullName' => 'Super Admin',
                'phone' => '0822561955',
                'password' => bcrypt('123123'),
            ]
        );
        // tao vai tro neu chưa có
        $role = Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'api'
        ]);
        $superAdmin->assignRole($role);
    }
}
