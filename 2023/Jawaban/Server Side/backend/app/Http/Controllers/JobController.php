<?php

namespace App\Http\Controllers;

use App\Models\AvailablePosition;
use App\Models\JobApplyPosition;
use App\Models\JobApplySocieties;
use App\Models\JobCategory;
use App\Models\JobVacancies;
use App\Models\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function jobVacancies(Request $request)
    {
        $vacancies = JobVacancies::all();

        return response()->json([
            'body' => [
                "vacancies" => $vacancies->map(function ($vacancy) {
                    return [
                        "id" => $vacancy->id,
                        "category" => [
                            "id" => $vacancy->jobCategory->id,
                            "job_category" => $vacancy->jobCategory->job_category,
                        ],
                        "Company" => $vacancy->company,
                        "address" => $vacancy->address,
                        "description" => $vacancy->description,
                        "available_position" => $vacancy->available->map(function ($available) {
                            return [
                                "position" => $available->position,
                                "capacity" => $available->capacity,
                                "apply_capacity" => $available->apply_capacity,
                            ];
                        })
                    ];
                })
            ]

        ], 200);
    }

    public function jobVacanciesById(Request $request, $id)
    {
        $vacancy = JobVacancies::where('id', $id)->first();

        return response()->json([
            'body' => [
                "vacancies" => [
                    "id" => $vacancy->id,
                    "category" => [
                        "id" => $vacancy->jobCategory->id,
                        "job_category" => $vacancy->jobCategory->job_category,
                    ],
                    "Company" => $vacancy->company,
                    "address" => $vacancy->address,
                    "description" => $vacancy->description,
                    "available_position" => $vacancy->available->map(function ($available) {
                        return [
                            "position" => $available->position,
                            "capacity" => $available->capacity,
                            "apply_capacity" => $available->apply_capacity,
                        ];
                    })
                ]
            ]

        ], 200);
    }

    public function application(Request $request)
    {
        $user = $request->attributes->get('token')->tokenable;
        $validate = Validator::make($request->all(), [
            'vacancy_id' => 'required',
            'positions' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => 'Invalid fields',
                'errors' => $validate->errors()
            ], 401);
        }

        $validations = Validation::where('society_id', $user->id)->where('status', 'accepted')->first();
        if (!$validations) {
            return response()->json([
                'message' => 'Your data validator must be accepted by validator before'
            ], 401);
        }

        $position = AvailablePosition::where('id', $request->positions)->first();
        if ($position->position != $validations->job_position) {
            return response()->json([
                'message' => 'Your position is not valid for this job'
            ], 401);
        };

        $validateApplyPosition = JobApplyPosition::where('society_id', $user->id)->where('job_vacancy_id', $request->vacancy_id)->first();
        if ($validateApplyPosition) {
            $validateAvailable = AvailablePosition::where('id', $validateApplyPosition->position_id)->first();
            if ($validateAvailable) {
                return response()->json([
                    'message' => 'You have already applied for this job'
                ], 401);;
            }
        }

        $jobApplySocieties = JobApplySocieties::create([
            'notes' => $request->notes,
            'date' => now(),
            'society_id' => $user->id,
            'job_vacancy_id' => $request->vacancy_id,
        ]);

        $jobApplyPositions = JobApplyPosition::create([
            'date' => now(),
            'society_id' => $user->id,
            'job_vacancy_id' => $request->vacancy_id,
            'position_id' => $request->positions,
            'job_apply_societies_id' => $jobApplySocieties->id,
            'status' => 'pending'
        ]);

        return response()->json([
            'body' => [
                "message" => 'Applying for job successful'
            ]
        ]);
    }

    public function getApplication(Request $request)
    {
        $user = $request->attributes->get('token')->tokenable;
        $jobVacancies = JobVacancies::all();

        return response()->json([
            'body' => [
                "vacancies" => $jobVacancies->map(function ($jobVacancy) {
                    return [
                        "id" => $jobVacancy->id,
                        "category" => [
                            "id" => $jobVacancy->jobCategory->id,
                            "job_category" => $jobVacancy->jobCategory->job_category,
                        ],
                        "company" => $jobVacancy->company,
                        "address" => $jobVacancy->address,
                        "position" => $jobVacancy->available->jobApplyPositions->map(function ($jobApplyPosition) {
                            return [
                                "position" => $jobApplyPosition->availablePosition->position,
                                "apply_status" => $jobApplyPosition->status,
                                "notes" => $jobApplyPosition->jobApplySocieties->notes,
                            ];
                        })
                    ];
                })
            ]

        ]);
    }
}
