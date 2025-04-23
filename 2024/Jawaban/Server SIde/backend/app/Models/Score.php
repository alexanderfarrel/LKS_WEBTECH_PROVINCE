<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    use HasFactory;

    protected $table = 'scores';

    protected $fillable = [
        'user_id',
        'game_version_id',
        'score',
    ];

    public function getScoreOwner()
    {
        return $this->hasOne(User::class, 'id', 'user_id')->withTrashed();
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
