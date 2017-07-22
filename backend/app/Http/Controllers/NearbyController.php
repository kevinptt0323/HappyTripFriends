<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use proj4php\Proj4php;
use proj4php\Proj;
use proj4php\Point;

function WGS84toTWD97($lat, $lng) {
    $proj4 = new Proj4php();
    $projWGS84  = new Proj('EPSG:4326', $proj4);
    $projTWD97  = new Proj('EPSG:3826', $proj4);

    $pointSrc = new Point($lng, $lat, $projWGS84);
    $pointDst = $proj4->transform($projTWD97, $pointSrc);
    return ['x' => $pointDst->x, 'y' => $pointDst->y];
}

class NearbyController extends Controller {
    public function index(Request $request) {
        $lat = $request->input('lat'); 
        $lng = $request->input('lng'); 

        $pointDst = WGS84toTWD97($lat, $lng);

        return Response::json($pointDst, 200);
    }
}
