<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class AvailablePosition extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'available_positions';

    protected $fillable = [
        'job_vacancy_id',
        'position',
        'capacity',
        'apply_capacity',
    ];

    public function jobVacancy()
    {
        return $this->belongsTo(JobVacancies::class);
    }

    public function jobApplyPositions()
    {
        return $this->hasMany(JobApplyPosition::class, 'position_id', 'id');
    }
}
