<?php

namespace App\Http\Controllers;

use App\Services\AccountService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AccountController extends Controller
{
    protected AccountService $accountService;
    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['page', 'keyword', 'sort_order', 'per_page']);
            $accounts = $this->accountService->getAllAccount($filters);
            return response()->json($accounts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách tài khoản.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getAccountById($id)
    {
        try {
            $account = $this->accountService->getAccountById($id);
            if (!$account) {
                return response()->json(['message' => 'Tài khoản không tồn tại.'], 404);
            }
            $account->load('roles');
            return response()->json($account);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông tin tài khoản.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showRoles()
    {
        $roles = $this->accountService->showRoles();
        return response()->json([
            'roles' => $roles,
            'status' => 200,
        ]);
    }

    public function roleLevel(Request $request, $id)
    {
        $validatedData = $request->validate([
            'roles' => 'required|array',
        ]);
        try {
            $user = $this->accountService->getAccountById($id);
            if ($user) {
                if (isset($validatedData['roles']) && is_array($validatedData['roles'])) {
                    $roles = Role::whereIn('id', $validatedData['roles'])
                        ->where('guard_name', 'api')
                        ->get();
                    $user->syncRoles($roles);
                    app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
                    return response()->json(['message' => 'Cập nhập thành công thành công', 'status' => 200], 200);
                }
                return response()->json(['message' => 'Không có vai trò nào được cung cấp.', 'status' => 400], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi gắn vai trò.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
