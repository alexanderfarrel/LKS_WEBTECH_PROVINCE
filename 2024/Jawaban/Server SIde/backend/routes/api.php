<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\UsersController;
use App\Http\Middleware\PassLengthMiddleware;
use App\Http\Middleware\UserLengthMiddleware;
use App\Http\Controllers\AdministratorsController;

Route::post('/v1/auth/signup', [AuthController::class, 'signup'])->middleware([UserLengthMiddleware::class, PassLengthMiddleware::class]);
Route::post('/v1/auth/signin', [AuthController::class, 'signin'])->middleware([UserLengthMiddleware::class]);
Route::post('/v1/auth/signout', [AuthController::class, 'signout'])->middleware(['auth:sanctum']);

Route::get('/v1/admins', [AdministratorsController::class, 'getAllAdmins'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::get('/v1/users', [AdministratorsController::class, 'getAllUsers'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::post('/v1/users', [AdministratorsController::class, 'createUser'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::put('/v1/users/{id}', [AdministratorsController::class, 'updateUser'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::delete('/v1/users/{id}', [AdministratorsController::class, 'deleteUser'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::put('/v1/users/lock/{id}', [AdministratorsController::class, 'lockUser'])->middleware(['auth:sanctum', AdminMiddleware::class]);
Route::put('/v1/users/unlock/{id}', [AdministratorsController::class, 'unlockUser'])->middleware(['auth:sanctum', AdminMiddleware::class]);

Route::get('/v1/users/{username}', [UsersController::class, 'getUserByUsername']);
Route::get('v1/user', [UsersController::class, 'getUserByToken'])->middleware(['auth:sanctum']);

Route::get('/v1/games', [GamesController::class, 'getGames'])->middleware(['auth:sanctum']);
Route::post('/v1/games', [GamesController::class, 'postGames'])->middleware(['auth:sanctum']);
Route::get('/v1/games/{slug}', [GamesController::class, 'getGameBySlug']);
Route::post('/v1/games/{slug}/upload', [GamesController::class, 'uploadGame'])->middleware(['auth:sanctum']);
Route::get('/v1/games/{slug}/scores', [GamesController::class, 'getGameScoresBySlug']); //potensi tabrakan
Route::get('/v1/games/{slug}/{version}', [GamesController::class, 'getGameByVersion']); //cek gamenya ada di storage gak
Route::get('/v1/games/{slug}/{version}/download', [GamesController::class, 'downloadGame']); //download
Route::post('/v1/games/{slug}/scores', [GamesController::class, 'uploadScoreBySlug'])->middleware(['auth:sanctum']);
Route::put('/v1/games/{slug}', [GamesController::class, 'updateGameBySlug'])->middleware('auth:sanctum');
Route::delete('/v1/games/{slug}', [GamesController::class, 'deleteGameBySlug'])->middleware('auth:sanctum');

Route::fallback(function () {
    return response()->json([
        'status' => 'not-found',
        'message' => "Not found"
    ], 404);
});
