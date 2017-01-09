
/*
 *  Terminal window
 */
var $terminal_window = $('.terminal-window');
var $terminal_window_open = $terminal_window.find('.control-open');
var $terminal_window_close = $terminal_window.find('.control-close');
var $terminal_window_minimize = $terminal_window.find('.control-minimize');
var $terminal_window_content = $terminal_window.find('main');

$terminal_window_open.click(function () {
    $terminal_window.removeClass('minimized').removeClass('closed');
});
$terminal_window_close.click(function () {
    $terminal_window.addClass('closed');
});
$terminal_window_minimize.click(function () {
    $terminal_window.addClass('minimized');
});



/*
 *  Terminal
 */
var $terminal = $terminal_window_content.terminal({
    prompt: '>',
    promptUser: 'admin',
    promptDir: '/',
    prog: [
        {
            command: 'ls',
            help: 'ls',
            program: function (prompt, args) {
                prompt.wait();
                sendCommand('ls ' + args.join(' '), prompt,  function(data){
                    defaultDisplay(data,prompt);
                });

            }
        },
        {
            command: 'cd',
            help: 'cd [directory]',
            program: function (prompt, args) {
                prompt.wait()
                sendCommand('cd ' + args.join(' '), prompt,function(data){
                    defaultDisplay(data, prompt);
                    prompt.changeDir(data.output[0]);
                });
            }
        },
        {
            command: 'pwd',
            help: 'pwd',
            program: function (prompt, args) {
                prompt.wait()
                sendCommand('pwd ' + args.join(' '), prompt, function(data){
                    defaultDisplay(data,prompt);
                });
            }
        },
        {
            command: 'cat',
            help: 'cat [file]',
            program: function (prompt, args) {
                prompt.wait()
                sendCommand('cat ' + args.join(' '), prompt, function(data){
                    defaultDisplay(data,prompt);
                });
            }
        },
        

    ]
});

$terminal.terminal({
    'method': 'executeCallback',
    'callback': function(prompt){
        prompt.wait();
        sendCommand('pwd', prompt, function(data){
            prompt.changeDir(data.output[0]);
            prompt.exit();
        });
    }
});


function sendCommand(commandString, prompt, success) {
    prompt.load();
    var commandArray = commandString.split(' ');
    var command = commandArray.shift();
    var args = commandArray.join(' ');
    $.get('/run/'+command+'?args='+args, function (data) {
        success(data);
    });
}

function defaultDisplay(data, prompt){
    prompt.load(false);
    if (data.code == 0) {
        if (data.output.length > 0) {
            for(var i = 0; i < data.output.length; i++){
                prompt.out(data.output[i]);
            }

        }
    } else {
        if (data.output.length > 0) {
            for (var i = 0; i < data.output.length; i++) {
                prompt.err(data.output[i]);
            }

        } else {
            prompt.err("Unknow error");
        }
    }
    prompt.exit();
}