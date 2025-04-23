<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class JobApplySocieties extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'job_apply_societies';

    protected $fillable = [
        'notes',
        'date',
        'society_id',
        'job_vacancy_id'
    ];

    public $timestamps = false;

    // public function jobVacancy()
    // {
    //     return $this->hasOne(JobVacancies::class, 'id', 'job_vacancy_id');
    // }

    // public function checkDataInJobApplyPosition()
    // {
    //     return $this->hasOne(JobApplyPosition::class, 'society_id', 'society_id')->where('job_vacancy_id', $this->job_vacancy_id);
    // }

    // public function checkDataInAvailablePosition()
    // {
    //     return $this->checkDataInJobApplyPosition->hasOne(AvailablePosition::class, 'id', 'position_id');
    // }

    // public function position()
    // {
    //     return $this->checkDataInAvailablePosition->hasOne(JobCategory::class, 'job_category', 'position');
    // }
}
