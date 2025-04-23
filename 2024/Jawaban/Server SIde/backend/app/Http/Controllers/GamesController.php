<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameVersion;
use App\Models\PersonalAccessToken;
use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class GamesController extends Controller
{
    public function getGames(Request $req)
    {
        $page = $req->query('page', '0');
        $size = $req->query('size', '10');
        $sortBy = $req->query('sortBy', 'title');
        $sortDir = $req->query('sortDir', 'asc');

        if (!in_array($sortBy, ['title', 'popular', 'uploaddate'])) {
            return response()->json([
                'status' => 'invalid',
                'message' => "Sort by must be title, popular, uploaddate"
            ], 401);
        }

        $scoreSum = Score::select('game_version_id')->selectRaw('SUM(score) as highest_score')->groupBy('game_version_id');

        $latestUpload = GameVersion::select('game_id')->selectRaw('MAX(created_at) as latest_created_at')->groupBy('game_id');

        $games = Game::joinSub($scoreSum, 'highest_scores', function ($join) {
            $join->on('games.id', '=', 'highest_scores.game_version_id');
        })
            ->joinSub($latestUpload, 'latest_version', function ($join) {
                $join->on('games.id', '=', 'latest_version.game_id');
            })
            ->select(
                'games.*',
                DB::raw('highest_scores.highest_score'),
                DB::raw('latest_version.latest_created_at')
            );


        if ($sortBy == 'title') {
            $games->orderBy('title', $sortDir);
        } else if ($sortBy == 'popular') {
            $games->orderBy('highest_scores.highest_score', $sortDir);
        } else if ($sortBy == 'uploaddate') {
            $games->orderBy('latest_version.latest_created_at', $sortDir);
        }

        $games = $games->skip($page * $size)->take($size)->get();

        return response()->json(
            [
                "page" => $page,
                "size" => $size,
                "totalElements" => count($games),
                "content" => $games->map(function ($game) {
                    return  [
                        "slug" => $game->slug,
                        "title" => $game->title,
                        "description" => $game->description,
                        'thumbnail' => $game->thumbnail,
                        'thumbnailUrl' => $game->thumbnailUrl,
                        "uploadTimestamp" => $game->created_at,
                        "author" => $game->createdBy->username,
                        "scoreCount" => $game->highest_score,
                        'uploadDate' => $game->latest_created_at,
                    ];
                })
            ]
        );
    }

    public function postGames(Request $request)
    {
        $request->validate([
            'title' => 'required|min:3|max:60',
            'description' => 'required|min:0|max:200'
        ]);

        $user = Auth::user();
        $slug = str_replace(' ', '-', strtolower($request->title));

        // if existing slug return
        if (Game::where('slug', $slug)->first()) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Game title already exist'
            ], 400);
        }

        $game = Game::create([
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'created_by' => $user->id
        ]);

        return response()->json([
            'status' => 'success',
            'slug' => $game->slug
        ], 201);
    }

    public function getGameBySlug($slug)
    {
        $game = Game::with(['latestVersion', 'author'])->withCount('scores')->where('slug', $slug)->first();

        if (! $game) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Game not found'
            ], 404);
        }

        $version = GameVersion::where('game_id', $game->id)->get();

        $thumbnailUrl = "/storage/games/{$game->id}/thumbnail/thumbnail.png";
        if (!File::exists(storage_path("/app/public/games/{$game->id}/thumbnail/thumbnail.png"))) {
            $thumbnailUrl = null;
        }

        return response()->json([
            'slug' => $game->slug,
            'title' => $game->title,
            'description' => $game->description,
            'thumbnail' => $game->thumbnail,
            'thumbnailUrl' => $thumbnailUrl,
            'uploadTimestamp' => $game->uploadTimestamp,
            'author' => $game->author->username,
            'scoreCount' => $game->scores_count,
            'gamePath' => "/games/{$game->slug}/{$game->id}",
            'versionHistory' => $version->map(function ($version) {
                return [
                    'version' => $version->version,
                    'createdAt' => $version->created_at
                ];
            })
        ], 200);
    }

    public function uploadGame(Request $request, $slug)
    {
        $request->validate([
            'zipfile' => 'required|file|mimes:zip',
            'thumbnail' => 'required|mimes:png,jpg',
            'token' => 'required'
        ]);

        $oldToken = explode(" ", $request->token)[1];
        $token = SanctumPersonalAccessToken::findToken($oldToken);
        dd($token->tokenable);

        $zipfile = $request->file('zipfile');
        $thumbnail = $request->file('thumbnail');

        $user = Auth::user();
        $game = Game::where('slug', $slug)->first();

        if (! $game) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Game not found'
            ], 404);
        }

        if ($user->id !== $game->created_by) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'User is not author of the game'
            ], 400);
        }

        $version = "v1";
        $gameVersionDB = GameVersion::where('game_id', $game->id)->latest('created_at')->first();
        if ($gameVersionDB) {
            $newVersion = (int) explode('v', $gameVersionDB->version)[1];
            $version = "v" . ($newVersion + 1);
        }

        $zipfile->storeAs("games/{$game->id}/{$version}", 'game.zip', 'public');
        if ($thumbnail) {
            $thumbnail->storeAs("games/{$game->id}/thumbnail", 'thumbnail.png', 'public');
        }

        GameVersion::create([
            'game_id' => $game->id,
            'version' => $version,
            'storage_path' => "games/{$game->id}/{$version}/",
        ]);

        return response()->json([
            'status' => 'success'
        ], 200);
    }

    public function getGameByVersion($slug, $version)
    {
        $game_id = Game::where('slug', $slug)->first()->id;
        $filePath = "/app/public/games/{$game_id}/{$version}/game.zip";
        // is game exist
        if (!File::exists(storage_path($filePath))) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Game version not found',
            ], 404);
        } else {
            return response()->json([
                'status' => 'success'
            ], 200);
        }
    }
    public function downloadGame($slug, $version)
    {
        $game_id = Game::where('slug', $slug)->first()->id;
        $filePath = "/app/public/games/{$game_id}/{$version}/game.zip";
        return response()->download(storage_path($filePath));
    }

    public function updateGameBySlug(Request $request, $slug)
    {
        if (! $request->all()) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Missing data'
            ], 400);
        }
        $user = Auth::user();
        $game = Game::where('slug', $slug)->first();
        if ($game->created_by != $user->id) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'You are not the game author'
            ], 403);
        }
        // update game title dan description
        if ($request->title) {
            $game->update([
                'title' => $request->title,
            ]);
        } else if ($request->description) {
            $game->update([
                'description' => $request->description
            ]);
        } else {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Missing data'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
        ], 200);
    }

    public function deleteGameBySlug($slug)
    {
        $user = Auth::user();
        $game = Game::where('slug', $slug)->first();
        if ($game->created_by != $user->id) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'You are not the game author'
            ], 403);
        }
        Score::where('game_version_id', $game->id)->delete();
        GameVersion::where('game_id', $game->id)->delete();
        $game->delete();

        File::deleteDirectory(storage_path("/app/public/games/{$game->id}"));

        return response()->json([
            'status' => 'success'
        ], 204);
    }

    public function getGameScoresBySlug($slug)
    {
        $game = Game::where('slug', $slug)->first();
        $scores = Score::with('getScoreOwner')->where('game_version_id', $game->id)->orderBy('score', 'desc')->get();
        return response()->json([
            'scores' => $scores->map(function ($score) {
                return [
                    'username' => $score->getScoreOwner?->username ?? "Unknown Player",
                    'score' => $score->score,
                    'timestamp' => $score->created_at
                ];
            })
        ]);
    }

    public function uploadScoreBySlug(Request $request, $slug)
    {
        if (!$request->score) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Missing data'
            ], 400);
        }

        $user = Auth::user();
        $game = Game::where('slug', $slug)->first();
        Score::create([
            'user_id' => $user->id,
            'game_version_id' => $game->id,
            'score' => $request->score
        ]);

        return response()->json([
            'status' => 'success'
        ], 201);
    }
}
