<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ValidationsController;
use App\Http\Middleware\TokenValidateMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/tokenValidate', [AuthController::class, 'tokenValidate'])->middleware([TokenValidateMiddleware::class]);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware([TokenValidateMiddleware::class]);

    Route::post('/validations', [ValidationsController::class, 'validations'])->middleware([TokenValidateMiddleware::class]);
    Route::get('/validations', [ValidationsController::class, 'index'])->middleware([TokenValidateMiddleware::class]);

    Route::get('/job_vacancies', [JobController::class, 'jobVacancies'])->middleware([TokenValidateMiddleware::class]);
    Route::get('/job_vacancies/{id}', [JobController::class, 'jobVacanciesById'])->middleware([TokenValidateMiddleware::class]);
    Route::post('/applications', [JobController::class, 'application'])->middleware([TokenValidateMiddleware::class]);
    Route::get('/applications', [JobController::class, 'getApplication'])->middleware([TokenValidateMiddleware::class]);

    Route::get('/test', function () {
        return response()->json([
            'message' => 'Success'
        ]);
    });
});


Route::fallback(function () {
    return response()->json([
        'message' => 'Not Found'
    ]);
}, 404);
