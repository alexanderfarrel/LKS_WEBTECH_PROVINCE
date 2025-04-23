<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $user = User::where('username', $request->username)->first();
        if ($user) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Username already exist'
            ], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'status' => 'success',
            'role' => 'user',
            'token' => $user->createToken('API TOKEN')->plainTextToken,
        ], 201);
    }

    public function signin(Request $request)
    {
        // check is user login
        $user = User::where('username', $request->username)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            if ($user->delete_reason) {
                return response()->json([
                    'status' => 'blocked',
                    'message' => "your account has blocked because {$user->delete_reason}"
                ], 400);
            }
            return response()->json([
                'status' => 'success',
                'role' => 'user',
                'token' => $user->createToken('API TOKEN')->plainTextToken,
            ], 200);
        }

        // check is admin login
        $admin = Admin::where('username', $request->username)->first();
        if ($admin && Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status' => 'success',
                'role' => 'admin',
                'token' => $admin->createToken('API TOKEN')->plainTextToken
            ], 200);
        };

        return response()->json([
            'status' => 'invalid',
            'message' => 'Wrong username or password'
        ], 401);
    }

    public function signout(Request $request)
    {
        // delete all access token
        $user = Auth::user();
        $isUser = User::where('username', $user->username)->first();
        if ($isUser) {
            $isUser->update([
                'last_login_at' => now(),
            ]);
        }
        $isAdmin = Admin::where('username', $user->username)->first();
        if ($isAdmin) {
            $isAdmin->update([
                'last_login_at' => now(),
            ]);
        }
        $request->user()->tokens()->delete();
        return response()->json([
            'status' => 'success',
        ], 200);
    }
}
