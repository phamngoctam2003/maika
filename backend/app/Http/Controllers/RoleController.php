<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\RoleRequest;
use Illuminate\Database\QueryException;

class RoleController extends Controller
{
    protected $super_admin;
    protected $user_role;
    public function __construct()
    {
        $this->super_admin = ['Admin'];
        $this->user_role = ['Users'];
    }

    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $roles = Role::search($filters['keyword'] ?? null)
            ->applyFilters($filters);
        return response()->json($roles);
    }
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'guard_name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);
        if ($request->permissions) {
            $permissions = Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        return response()->json([
            'role' => $role,
            'assigned_permissions' => $permissions ?? [],
            'status' => 200,
        ]);
    }

    public function show($roleId)
    {
        $role = Role::findOrFail($roleId);
        $role->permissions;
        return response()->json([
            'role' => $role,
            'status' => 200,
        ]);
    }
    public function showPermissions()
    {
        $permissions = Permission::all();
        return response()->json([
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'guard_name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);
        $specialRoles = Role::where('name', $this->super_admin)
            ->orWhere('name', $this->user_role)
            ->pluck('id')
            ->toArray();
        if (in_array($id, $specialRoles)) {
            return response()->json(['message' => 'Thất bại: Không thể cập nhật các vai trò đặc biệt']);
        }


        try {
            $role = Role::findOrFail($id);
            $role->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            if ($request->has('permissions') && !empty($request->permissions)) {
                $permissions = Permission::whereIn('id', $request->permissions)
                    ->where('guard_name', $request->guard_name)
                    ->get();
                $role->syncPermissions($permissions);
            } else {
                $role->syncPermissions([]);
            }
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            return response()->json([
                'status' => 200,
                'role' => $role,
                'permissions' => $request->has('permissions'),
                'assigned_permissions' => $request->has('permissions') ? $role->permissions : [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update role.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function destroy(Request $request)
    {
        $ids = $request->ids;
        $roles = Role::whereIn('id', $ids)->pluck('name')->toArray();

        if (array_intersect($this->user_role, $roles) || array_intersect($this->super_admin, $roles)) {
            return response()->json(['message' => 'Xóa thất bại: Không thể xóa các vai trò đặc biệt']);
        }
        if (is_array($ids) && !empty($ids)) {
            try {
                Role::whereIn('id', $ids)->delete();
                app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
                return response()->json(['message' => 'Xóa vai trò thành công', 'status' => 200]);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa thất bại', 'status' => 'error'], 400);
        }
    }
}