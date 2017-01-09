<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>Terminal</title>
    <meta name="description" content="Terminal emulator using JQuery">
    <meta name="author" content="Florent Nosari">
    <link rel="shortcut icon" href="icon.png" />
    <meta name="theme-color" content="#232323">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Terminal" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="Terminal emulator using JQuery" />
    <meta property="og:image" content="icon.png" />

    


    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="{{url('/')}}/stylesheets/screen.css">
</head>

<body>
    <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->



    <section class="terminal-window">
        <header>
            <nav class="controls">
                <span class="control-item control-close"><i class="bull"></i></span>
                <span class="control-item control-minimize"><i class="bull"></i></span>
                <span class="control-item control-open"><i class="bull"></i></span>
            </nav>
        </header>
        <main>

        </main>
    </section>







    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="{{url('/')}}/js/terminal.js"></script>
    <script src="{{url('/')}}/js/app.js"></script>
</body>

</html>