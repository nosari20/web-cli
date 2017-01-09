<?php
//header('Content-Type: application/json');

session_start();
if(!isset($_SESSION['dir'])){
    $_SESSION['dir'] = getcwd();
}
//set directory
$dir = $_SESSION['dir'];
$addonDir = getcwd().'/addons/';

//config.ini
$config = parse_ini_file('config.ini');
$php = $config['php'];






if(isset($_GET['command'])){
    $command = $_GET['command'];
    $commandArray = explode(' ', $command);
    switch($commandArray[0]){
        case 'pwd':
            $output = [str_replace(['\\\\','\\','/','//'],'/',$dir)];
            $code = 0;
            break;
        case 'ls': 
            chdir($dir);
            $output = scandir((isset($commandArray[1]) ? $commandArray[1] : getcwd()));
            $code = ($output == false ? 1 : 0);
            break;
        case 'cd': 
            if(isset($commandArray[1])){
                if($commandArray[1][0]=='/'){
                    $output = @chdir($commandArray[1]);
                }else{
                   $output = @chdir($dir.'/'.$commandArray[1]); 
                }
                if($output){
                    $_SESSION['dir'] = getcwd();
                    $dir = $_SESSION['dir'];
                    
                    $output = [$dir];
                }
            }else{
                $output = false;
            } 
                $code = ($output == false ? 1 : 0);
            break;
        case 'composer':
            chdir($dir);
            array_shift($commandArray);
            exec($php.' '.$addonDir.'composer.phar '.implode(' ', $commandArray) , $output, $code);
            break;
        default :
            exec($command, $output, $code);
    }
    
    echo json_encode([
        'output'=> $output,
        'code'=>$code
        ]);
}else{
    echo json_encode([
        'error' => 'No command'
    ]);
}