<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Trip extends Model
{
    protected $table = "trip";

    protected $fillable = ['name', 'data'];

    public $incrementing = false;

    public static function boot() {
        parent::boot();

        static::creating(function ($spot) {
            do {
                $id = Str::quickRandom(10);
            } while (self::find($id));
            $spot->id = $id;
        });
    }

    public function setDataAttribute($value) {
        $this->attributes['data'] = json_encode($value);
    }

    public function getDataAttribute($value) {
        return json_decode($value);
    }
}
