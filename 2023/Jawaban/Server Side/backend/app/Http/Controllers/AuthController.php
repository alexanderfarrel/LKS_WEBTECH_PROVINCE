<?php

namespace App\Http\Controllers;

use App\Models\Societies;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function tokenValidate(Request $request)
    {
        $user = $request->attributes->get('token')->tokenable;
        return response()->json([
            'body' => [
                'userData' => $user
            ]
        ]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'id_card_number' => 'required',
            'password' => 'required',
        ]);

        $societies = Societies::where('id_card_number', $request->id_card_number)->first();
        if ($societies->password == $request->password) {
            return response()->json([
                'body' => [
                    'name' => $societies->name,
                    'born_date' => $societies->born_date,
                    "gender" => $societies->gender,
                    "address" => $societies->address,
                    "token" => $societies->createToken('api_token')->plainTextToken,
                    "regional" => [
                        'id' => $societies->regional->id,
                        'province' => $societies->regional->province,
                        'district' => $societies->regional->district
                    ]

                ]
            ], 200);
        }

        return response()->json([
            'message' => 'ID Card Number or Password incorrect'
        ], 401);
    }

    public function logout(Request $request)
    {
        $token = $request->attributes->get('token');
        $token->delete();
        return response()->json([
            'message' => 'Logout Success'
        ], 200);
    }
}
