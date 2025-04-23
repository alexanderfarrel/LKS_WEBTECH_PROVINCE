<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class JobVacancies extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'job_vacancies';

    protected $fillable = [
        'job_category_id',
        'company',
        'address',
        'description',
    ];

    public function available()
    {
        return $this->hasOne(AvailablePosition::class, 'job_vacancy_id', 'id');
    }

    public function jobCategory()
    {
        return $this->hasOne(JobCategory::class, 'id', 'job_category_id');
    }

    public function jobApplyPositions()
    {
        return $this->hasMany(JobApplyPosition::class, 'position_id', 'id');
    }

    public function jobApplySocieties()
    {
        return $this->belongsTo(JobApplySocieties::class);
    }
}
