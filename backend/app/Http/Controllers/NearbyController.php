<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use proj4php\Proj4php;
use proj4php\Proj;
use proj4php\Point;

use App\Spot;

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

class NearbyController extends Controller {
    public static $landmark_api = "http://egis.moea.gov.tw/MoeaEGFxData_WebAPI_Inside/InnoServe/LandMark";

    public function index(Request $request) {
        if ($request->has('center')) {
            $center = $request->input('center');
            $lng = $center['lng'];
            $lat = $center['lat'];
        } else {
            $lng = $request->input('lng');
            $lat = $request->input('lat');
        }
        if ($request->has('radius')) {
            $radius = $request->input('radius');
        } else {
            $radius = 500;
        }

        $pointDst = WGS84toTWD97($lng, $lat);

        $client = new Client();
        $ret = $client->request('GET', self::$landmark_api, [
            'query' => [
                'resptype' => 'GeoJson',
                'x' => $pointDst->x,
                'y' => $pointDst->y,
                'buffer' => $radius
            ]
        ]);

        $res = json_decode($ret->getBody());

        $tmp = array_map(function($feature) use (&$tmp, $lat, $lng) {
            $pointDst = TWD97toWGS84($feature->geometry->coordinates[0], $feature->geometry->coordinates[1]); $spot = new Spot;
            $spot->name = $feature->properties->LandMark;
            $spot->lng = round($pointDst->x, 6);
            $spot->lat = round($pointDst->y, 6);
            return ['spot' => $spot, 'distance' => distance($lat, $lng, $spot->lat, $spot->lng)];
        }, $res->features);

        return Response::json($tmp, 200);
    }
}
