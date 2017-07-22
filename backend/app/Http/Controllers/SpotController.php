<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use App\Spot;

class SpotController extends Controller {
    public function index(Request $request) {
        $query = Spot::query();
        if ($request->has('type')) {
            $type = $request->input('type');
            $query = $query->where('type', 'LIKE',  '%' . $type . '%');
        }
        if ($request->has('name')) {
            $name = $request->input('name');
            $query = $query->where('name', 'LIKE',  '%' . $name . '%');
        }
        if ($request->has('limit')) {
            $limit = $request->input('limit');
        } else {
            $limit = 100;
        }
        return Response::json($query->limit($limit)->get(), 200);
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
