<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameVersion extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'game_versions';

    protected $fillable = [
        'game_id',
        'version',
        'storage_path',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
