<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdministratorsResource;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdministratorsController extends Controller
{
    public function getAllAdmins()
    {
        $allAdmins = Admin::all();
        return response()->json([
            'totalElements' => count($allAdmins),
            'content' => AdministratorsResource::collection($allAdmins)
        ], 200);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'username' => 'required|min:4|max:60',
            'password' => 'required|min:5|max:10',
        ]);

        $user = User::where('username', $request->username)->first();
        if ($user) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Username already exist'
            ], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => 'success',
            'username' => $user->username,
        ]);
    }

    public function getAllUsers()
    {
        $allUsers = User::paginate(30);
        return response()->json([
            'totalElements' => count($allUsers),
            'content' => AdministratorsResource::collection($allUsers)
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'User not found'
            ], 404);
        }
        // username must unique
        if ($request->username && $request->username !== $user->username) {
            $userExist = User::where('username', $request->username)->first();
            if ($userExist) {
                return response()->json([
                    'status' => 'invalid',
                    'message' => 'Username already exist'
                ], 400);
            }
            // $user->username = $request->username;
            $user->update([
                'username' => $request->username
            ]);
        }
        if ($request->password && !Hash::check($request->password, $user->password)) {
            // $user->password = Hash::make($request->password);
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }
        // $user->save();
        return response()->json([
            'status' => 'success',
            'username' => $user->username,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'User not found'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => 'success',
        ], 204);
    }

    public function lockUser(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required',
        ]);
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'User not found'
            ], 404);
        }
        $user->update([
            'delete_reason' => $request->reason
        ]);
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    public function unlockUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'User not found'
            ], 404);
        }

        $user->update([
            'delete_reason' => null
        ]);
        return response()->json([
            'status' => 'success',
        ], 200);
    }
}
