<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class JobApplyPosition extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'job_apply_positions';

    protected $fillable = [
        'date',
        'society_id',
        'job_vacancy_id',
        'position_id',
        'job_apply_societies_id',
        'status',
    ];

    public $timestamps = false;

    public function availablePosition()
    {
        return $this->hasOne(AvailablePosition::class, 'id', 'position_id');
    }
    public function jobApplySocieties()
    {
        return $this->belongsTo(JobApplySocieties::class);
    }

    // public function jobVacancy()
    // {
    //     return $this->belongsTo(JobVacancies::class);
    // }
}
