<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Spot extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('spot', function (Blueprint $table) {
            $table->string('id', 10)->primary();
            $table->string('name', 256);
            $table->string('address', 1024)->nullable();
            $table->string('phone_number', 16)->nullable();
            $table->string('type', 32)->nullable();
            $table->float('lat', 8, 6)->nullable();
            $table->float('lng', 9, 6)->nullable();
            $table->timestampsTZ();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('spot');
    }
}
