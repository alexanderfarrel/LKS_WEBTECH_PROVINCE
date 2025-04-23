<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Game;
use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class UsersController extends Controller
{
    public function getUserByUsername($username)
    {
        $user = User::where('username', $username)->first();
        if (! $user) {
            return response()->json([
                'status' => 'not-found',
                'message' => 'User not found'
            ], 404);
        }
        // get all games authored by user
        $authoredGames = Game::where('created_by', $user->id)->get() ?? null;
        $highScores = Score::where('user_id', $user->id)->select('game_version_id')->selectRaw('MAX(score) as highest_score, game_version_id, MAX(created_at) as timestamp')->groupBy('game_version_id')->get();

        $highScoreDetails = $highScores->map(function ($score) {
            $game = Game::find($score->game_version_id);
            return [
                'game' => [
                    'slug' => $game->slug,
                    'title' => $game->title,
                    'description' => $game->description,
                ],
                'score' => $score->highest_score,
                'timestamp' => $score->timestamp,
            ];
        });
        return response()->json([
            'username' => $user->username,
            'registeredTimestamp' => $user->created_at,
            'authoredGames' => $authoredGames->map(function ($game) {
                return [
                    'slug' => $game->slug,
                    'title' => $game->title,
                    'description' => $game->description,
                ];
            }),
            'highScores' => $highScoreDetails,
        ], 200);
    }

    public function getUserByToken()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json([
                'status' => 'unauthorized',
                'message' => 'Unauthorized'
            ], 401);
        }

        $isAdmin = Admin::where('username', $user->username)->first();
        if ($isAdmin) {
            return response()->json([
                'username' => $user->username,
                'role' => 'admin',
            ]);
        }

        return response()->json([
            'username' => $user->username,
            'role' => 'user',
        ]);
    }
}
