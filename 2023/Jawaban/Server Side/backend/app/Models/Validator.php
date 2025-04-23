<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Validator extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'validators';

    protected $fillable = [
        'user_id',
        'role',
        'name'
    ];

    public function validations()
    {
        return $this->belongsTo(Validation::class);
    }
}
