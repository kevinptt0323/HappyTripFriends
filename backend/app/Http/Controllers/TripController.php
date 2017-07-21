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
}
