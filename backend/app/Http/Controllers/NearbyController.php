<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use App\Spot;

class NearbyController extends Controller {
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

        $spots = Spot::nearby($lat, $lng, $radius);
        if ($request->has('type')) {
            $type = $request->input('type');
            $spots = $spots->filter(function($spot) use ($type) {
                return $spot['spot']['type'] == $type;
            })->values();
        }

        return Response::json($spots, 200);
    }
}
