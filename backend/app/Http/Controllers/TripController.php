<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use App\Trip;

class TripController extends Controller
{
    public function index()
    {
        return Response::json(Trip::all(), 200);
    }

    public function store(Request $request) {
        $form = $request->all();
        $ret = Trip::create($form);
        return Response::json($ret, 200);
    }

    public function show($id) {
        $ret = Trip::find($id);
        return Response::json($ret, 200);
    }
}
