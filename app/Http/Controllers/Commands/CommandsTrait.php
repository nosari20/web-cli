<?php

namespace App\Http\Controllers\Commands;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Session\Session;

trait CommandsTrait{

    public function exec($command, $args)
    {

        // Init current directory
        if(!session()->has('dir')){
            session()->put('dir', getcwd());
        }
        $dir = session()->get('dir');
        $realdir = getcwd();

        // Execute command
        if(method_exists($this,$command)){
            return $this->$command($command, $args, $dir, $realdir);
        }

    }

    public function ls($command, $args, $dir, $realdir)
    {
        chdir($dir);
        $output = scandir((isset($args[0]) ? $args[0] : getcwd()));
        $code = ($output == false ? 1 : 0);
        return [
            'output' => $output,
            'code' => $code,
        ];
    }

    public function pwd($command, $args, $dir, $realdir)
    {
        $output = [str_replace(['\\\\','\\','/','//'],'/',$dir)];
        $code = 0;
        return [
            'output' => $output,
            'code' => $code,
        ];
    }

    public function cd($command, $args, $dir, $realdir)
    {
        if(isset($args[0])){
            if($args[0][0]=='/'  || $args[0][0]=='\\'){
                $output = @chdir($args[0]);
            }else{
                $output = @chdir($dir.'/'.$args[0]); 
            }
            if($output != false){
                session()->put('dir', getcwd()); 
                $dir = session()->get('dir');            
                $output = [$dir];
            }else{
                $output = false;
            }
        }else{
            $output = false;
        } 
        $code = ($output == false ? 1 : 0);
        return [
            'output' => $output,
            'code' => $code,
        ];
    }

    public function cat($command, $args, $dir, $realdir)
    {
        if(isset($args[0])){
            if(is_file ($dir.'/'.$args[0])){
                $output = file($dir.'/'.$args[0]);
            }else{
                $output = ['File not found'];
            }
            
        }else{
            $output = false;
        } 
        $code = ($output == false ? 1 : 0);
        return [
            'output' => $output,
            'code' => $code,
        ];
    }

    public function php($command, $args, $dir, $realdir)
    {
        if(count($args) == 0){
            $args[] = '--version';
        }
        chdir($dir);
        exec(env('php','php').' '.implode(' ',$args), $output, $code );
        return [
            'output' => $output,
            'code' => $code,
        ];
    }

    public function composer($command, $args, $dir, $realdir)
    {
        if(count($args) == 0){
            $args[] = '--version';
        }
        chdir($dir);
        exec(env('php','php').' '.$realdir.'/../addons/composer.phar '.implode(' ',$args), $output, $code );
        return [
            'output' => $output,
            'code' => $code,
        ];
    }



    

}