<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Regional extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'regionals';

    protected $fillable = [
        'province',
        'district',
    ];

    public function societies()
    {
        return $this->belongsTo(Societies::class);
    }
}
