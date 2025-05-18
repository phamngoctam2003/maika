<?php

namespace App\Http\Middleware;

use Tymon\JWTAuth\Facades\JWTAuth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithJwt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookies->get('user-info');
        if($token){
            try {
                // Xác thực token
                $user = JWTAuth::setToken($token)->authenticate();
            } catch (\Exception $e) {
                // 
                return response()->json(['error' => 'Token không hợp lệ! ok'], 401);
            }
        }else {
            return response()->json(['error' => 'Token không tồn tại! ok'], 401);
        }
        return $next($request);
    }
}
