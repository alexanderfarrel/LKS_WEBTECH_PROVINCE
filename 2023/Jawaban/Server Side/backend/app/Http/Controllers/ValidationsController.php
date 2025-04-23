<?php

namespace App\Http\Controllers;

use App\Models\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ValidationsController extends Controller
{
    public function validations(Request $request)
    {
        $user = $request->attributes->get('token')->tokenable;
        $validator = Validator::make($request->all(), [
            'work_experience' => 'required',
            'job_category_id' => 'required',
            'job_position' => 'required',
            'reason_accepted' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validator_message' => $validator->errors(),
                'message' => 'Request data validation failed'
            ], 400);
        }

        $validation = Validation::create([
            'society_id' => $user->id,
            'validator_id' => null,
            'status' => 'pending',
            'validator_notes' => null,
            'work_experience' => $request->work_experience,
            'job_category_id' => $request->job_category_id,
            'job_position' => $request->job_position,
            'reason_accepted' => $request->reason_accepted,
        ]);

        return response()->json([
            'body' => [
                'message' => 'Request data validation sent successful'
            ]
        ], 200);
    }

    public function index(Request $request)
    {
        // get all data
        $validations = Validation::all();
        return response()->json([
            'body' => [
                'validations' => $validations->map(function ($validation) {
                    return [
                        "id" => $validation->id,
                        "status" => $validation->status,
                        "work_experience" => $validation->work_experience,
                        "job_category_id" => $validation->job_category_id,
                        "job_position" => $validation->job_position,
                        "reason_accepted" => $validation->reason_accepted,
                        "validator_notes" => $validation->validator_notes,
                        "validator" => $validation->validator
                    ];
                })
            ]
        ]);
    }
}
