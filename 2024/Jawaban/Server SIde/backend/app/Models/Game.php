<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\File;

class Game extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'games';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'created_by',
    ];

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by')->withTrashed();
    }

    public function latestVersion()
    {
        return $this->hasOne(GameVersion::class, 'game_id', 'id')->latest('created_at');
    }


    public function getThumbnailAttribute()
    {
        return $this->latestVersion ? "/games/{$this->slug}/{$this->latestVersion->version}/thumbnail.png" : null;
    }

    public function getUploadTimestampAttribute()
    {
        return $this->latestVersion ? $this->latestVersion->created_at : null;
    }
    public function getThumbnailUrlAttribute()
    {

        $thumbnailUrl = "/storage/games/{$this->id}/thumbnail/thumbnail.png";
        if (!File::exists(storage_path("/app/public/games/{$this->id}/thumbnail/thumbnail.png"))) {
            $thumbnailUrl = null;
        }

        return $thumbnailUrl;
    }
}
