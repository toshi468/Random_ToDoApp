<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
//a
class Task extends Model
{
    protected $fillable = [
        'text',
        'completed',
        'min_duration',
        'max_duration',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];
}