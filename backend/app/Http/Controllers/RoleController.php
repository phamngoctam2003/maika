<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\RoleRequest;
use Illuminate\Database\QueryException;

class RoleController extends Controller
{
    protected $super_admin;
    public function __construct()
    {
        $this->super_admin = ['4'];
    }

    public function index()
    {
        $roles = Role::orderBy('id', 'desc')->get();
        return response()->json([
            'roles' => $roles,
        ]);
    }
    public function create(RoleRequest $request)
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

    public function update(Request $request, $roleId)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $roleId,
            'guard_name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);
        if (array_intersect((array) $this->super_admin, (array) [$roleId])) {
            return response()->json(['message' => 'Thất bại: Không thể cập nhật các vai trò đặc biệt']);
        }
        try {
            $role = Role::findOrFail($roleId);
            $role->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);
            $permissions = Permission::whereIn('id', $request->permissions)
                ->where('guard_name', $request->guard_name)
                ->get();
            $role->syncPermissions($permissions);
            return response()->json([
                'status' => 200,
                'role' => $role,
                'assigned_permissions' => $permissions,
            ]);
        } catch (\Exception $e) {
            // Xử lý ngoại lệ
            return response()->json([
                'message' => 'Failed to update role.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (array_intersect($this->super_admin, $ids)) {
            return response()->json(['message' => 'Xóa thất bại: Không thể xóa các vai trò đặc biệt']);
        }
        if (is_array($ids) && !empty($ids)) {
            try {
                Role::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa vai trò thành công', 'status' => 200]);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa thất bại', 'status' => 'error'], 400);
        }
    }
}
