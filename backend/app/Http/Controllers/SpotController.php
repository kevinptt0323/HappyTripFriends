<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use App\Spot;

class SpotController extends Controller {
    public function index() {
        return Response::json(Spot::all(), 200);
    }

    public function store(Request $request) {
        $form = $request->all();
        $ret = Spot::create($form);
        if ($ret) {
            return Response::json($ret, 200);
        } else {
            return Response::json([
                'error' => 'create spot failed',
            ], 400);
        }
    }
}
