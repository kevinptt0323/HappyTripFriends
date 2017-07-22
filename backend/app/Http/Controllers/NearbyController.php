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

class NearbyController extends Controller {
    public static $landmark_api = "http://egis.moea.gov.tw/MoeaEGFxData_WebAPI_Inside/InnoServe/LandMark";

    public function index(Request $request) {
        $lng = $request->input('lng'); 
        $lat = $request->input('lat'); 

        $pointDst = WGS84toTWD97($lng, $lat);

        $client = new Client();
        $ret = $client->request('GET', self::$landmark_api, [
            'query' => [
                'resptype' => 'GeoJson',
                'x' => $pointDst->x,
                'y' => $pointDst->y,
                'buffer' => 500
            ]
        ]);

        $res = json_decode($ret->getBody());

        $tmp = [];

        array_map(function($feature) use (&$tmp) {
            $pointDst = TWD97toWGS84($feature->geometry->coordinates[0], $feature->geometry->coordinates[1]); $spot = new Spot;
            $spot->name = $feature->properties->LandMark;
            $spot->lng = round($pointDst->x, 8);
            $spot->lat = round($pointDst->y, 8);
            array_push($tmp, $spot);
        }, $res->features);

        return Response::json($tmp, 200);
    }
}
