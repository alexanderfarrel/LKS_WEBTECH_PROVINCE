<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Societies extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'societies';

    protected $fillable = [
        'id_card_number',
        'password',
        'name',
        'born_data',
        'gender',
        'address',
        'regional_id',
        'login_tokens'
    ];

    protected $hidden = [
        'password'
    ];

    public function regional()
    {
        return $this->hasOne(Regional::class, 'id', 'regional_id');
    }
}
