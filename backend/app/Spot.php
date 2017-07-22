<?php

namespace App;

use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

use proj4php\Proj4php;
use proj4php\Proj;
use proj4php\Point;

function WGS84toTWD97($x, $y) {
    $proj4 = new Proj4php();
    $projWGS84  = new Proj('EPSG:4326', $proj4);
    $projTWD97  = new Proj('EPSG:3826', $proj4);

    $pointSrc = new Point($x, $y, $projWGS84);
    $pointDst = $proj4->transform($projTWD97, $pointSrc);
    return $pointDst;
}

function TWD97toWGS84($x, $y) {
    $proj4 = new Proj4php();
    $projWGS84  = new Proj('EPSG:4326', $proj4);
    $projTWD97  = new Proj('EPSG:3826', $proj4);

    $pointSrc = new Point($x, $y, $projTWD97);
    $pointDst = $proj4->transform($projWGS84, $pointSrc);
    return $pointDst;
}

function distance($lat1, $lon1, $lat2, $lon2) {
    $theta = $lon1 - $lon2;
    $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    $meter = $dist * 60 * 1.1515 * 1.609344 * 1000;
    return round($meter);
}

class Spot extends Model
{
    protected $table = "spot";

    protected $fillable = ['name', 'address', 'phone_number', 'type', 'lat', 'lng'];

    public $incrementing = false;

    public static $landmark_api = "http://egis.moea.gov.tw/MoeaEGFxData_WebAPI_Inside/InnoServe/LandMark";

    public static function boot() {
        parent::boot();

        static::creating(function ($spot) {
            do {
                $id = Str::quickRandom(10);
            } while (self::find($id));
            $spot->id = $id;
        });
    }

    public static function nearby($lat, $lng, $radius) {
        $lat_sin = sin(deg2rad($lat));
        $lat_cos = cos(deg2rad($lat));
        $dist = $radius / (60 * 1.1515 * 1.609344 * 1000);
        $spots = Spot::whereRaw('DEGREES(ACOS(SIN(RADIANS(lat)) * ? + COS(RADIANS(lat)) * ? * COS(RADIANS(lng - ?)))) <= ?', [$lat_sin, $lat_cos, $lng, $dist])->get();
        $spots = collect($spots);

        $pointDst = WGS84toTWD97($lng, $lat);
        $client = new Client();
        $ret = json_decode($client->request('GET', self::$landmark_api, [
            'query' => [
                'resptype' => 'GeoJson',
                'x' => $pointDst->x,
                'y' => $pointDst->y,
                'buffer' => min(5000, $radius)
            ]
        ])->getBody());

        $spots2 = array_map(function($feature) {
            $pointDst = TWD97toWGS84($feature->geometry->coordinates[0], $feature->geometry->coordinates[1]);
            $spot = new Spot;
            $spot->id = "(null)";
            $spot->name = $feature->properties->LandMark;
            $spot->type = "(經濟部)";
            $spot->lat = round($pointDst->y, 6);
            $spot->lng = round($pointDst->x, 6);
            return $spot;
        }, $ret->features);

        $spots2 = collect($spots2);

        $spots = $spots->merge($spots2);

        $spots = $spots->map(function($spot) use ($lat, $lng) {
            return ['spot' => $spot, 'distance' => distance($lat, $lng, $spot->lat, $spot->lng)];
        })->sortBy('distance')->values();

        return $spots;
    }
}
