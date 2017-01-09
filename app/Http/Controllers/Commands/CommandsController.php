<?php

namespace App\Http\Controllers\Commands;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommandsController extends Controller
{
    use CommandsTrait;

    public function run(Request $request, $command){
        $args = $request->get('args');
        if(!$args){
            $args = [];
        }else{
            $args = explode(' ',$args);
        }

        $output = $this->exec($command, $args);
        if(!$output){
            $output = [
                'output' => ['Unknown command'],
                'code' => 1
            ];
        }
        return response()->json($output);
    }
}
