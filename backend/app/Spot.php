<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Spot extends Model
{
    protected $table = "spot";

    protected $fillable = ['name', 'address', 'phone_number', 'type', 'lat', 'lng'];

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
}
