(function ( $ ) { 
    Terminal = function(el,options) {
        var plugin = this;
        var $el = $(el);
        var history = {
            commands : [],
            index : -1
        } 
        /*
         * default command
         */
        var prog = [
               {
                   command : "echo",
                   help : "echo [string]",
                   program : function(prompt,args){
                       var text = "";
                       for(var w in args){
                           text += (args[w] + " ");
                       }
                       prompt.out(text);
                   }
                },
                {
                   command : "whoami",
                   help : "whoami",
                   program : function(prompt,args){
                       prompt.out("Florent NOSARI");
                   }
                },
                {
                   command : "help",
                   program : function(prompt,args){
                       $.each(plugin.options.prog,function(index,value){
                           if(value.help){
                            prompt.out("- "+value.help);
                           }else{
                               prompt.out("- "+value.command);
                           }
                       });
                       
                   }
                },
                {
                   command : "moo",
                   program : function(prompt,args){
                      prompt.out("         (__)");
                      prompt.out("         (oo)");
                      prompt.out("   /------\/");
                      prompt.out("  / |    ||");
                      prompt.out(" *  /\---/\\");
                      prompt.out("    ~~   ~~");
                      prompt.out("....\"Have you mooed today?\"...");
                       
                   }
                }
        ];
        plugin.function = {
                    out : function(text, color){
                        plugin.createLine(text, color).insertBefore(plugin.prompt);
                        plugin.promptBottom();
                    },
                    err : function(text){
                        plugin.createErrorLine(text).insertBefore(plugin.prompt);
                        plugin.promptBottom();
                    },
                    clear : function(text){
                        plugin.clear();
                    },
                    clearLastLine : function(text){
                        plugin.clearLastLine();
                    },
                    in : function(callback){
                        plugin.showPrompt(false);
                        plugin.deinitPromptHandlers();
                        var enter = function(e){
                            if (e.keyCode == 13) {
                                e.preventDefault();
                                    plugin.getPromptInput().off('keypress',enter);
                                    plugin.function.out(plugin.getPromptInput().text(), 'gray');
                                    callback(plugin.getPromptInput().text());  
                                    plugin.promptBottom();
                            }
                        }
                        plugin.getPromptInput().keypress(enter);
                        plugin.function.wait();
                    },
                    exec : function(command, args){
                        var parameters = args.split(" ");
                        var prog = plugin.eval(command);
                        if(prog){
                            plugin.execute(prog.program,parameters); 
                        }   
                    },                    
                    exit : function(){
                        plugin.showPrompt();
                        plugin.initPromptHandlers();
                        plugin.autoexit = true;
                        plugin.focusPrompt();
                    },
                    wait : function(load = false){
                        plugin.autoexit = false;                  
                        plugin.getPromptInput().keydown(plugin.promptCTRL_C);
                    },
                    load : function(load = true){ 
                        plugin.removeLoader() 
                        if(load){
                            plugin.addLoader();
                        }
                        
                    },
                    changeDir : function(dir){
                        plugin.options.promptDir = dir;
                    },
                    changeUser : function(usr){
                        plugin.options.promptUser = usr;
                    },
        }

        /*
         * Merge options commands and defaults and delete it from optons after
         */ 
        if(options.prog){
            prog = $.merge(prog, options.prog);
            delete options.prog;
        }      
        plugin.options = $.extend({
           prog : prog,
           prompt : "$",
        }, options);        
        plugin.init = function() {
             plugin.initPrompt();
             plugin.autoexit = true;
        }
        /*
         * Prompt
         */
        plugin.initPrompt = function(){
            plugin.terminal = $(
                                '<div class="terminal">'+
                                    '<div class="comment"><pre># use \'help\' to see available commands</pre></div>'+
                                '</div>'
                            ),
            $el.append(plugin.terminal);
            plugin.prompt = plugin.createPrompt();
            plugin.terminal.append(plugin.prompt);
            plugin.terminal.click(function(){
                plugin.focusPrompt();
            })
            plugin.initPromptHandlers();
        }
        plugin.addLoader = function(){
            $el.find('.terminal > .command').last().find('.command').append($('<i class="loader"><i>'));
        }
        plugin.removeLoader = function(){
            $el.find('.terminal > .command').last().find('.command').find('i').remove();
        }
        plugin.getFunctions = function(){
            return plugin.function;
        }
        plugin.createPrompt = function(){
            var prefix = '';
            if(plugin.options.promptUser){
                var user = plugin.options.promptUser;
                prefix = user;
            }
            if(plugin.options.promptDir){
                var dir = plugin.options.promptDir;
                if(plugin.options.promptUser){
                    prefix = user+'@'+dir;
                }else{
                    prefix = dir;
                }
                
            }

            return $('<div class="prompt line"><pre><span class="dollar">'+prefix+plugin.options.prompt+' </span><span contenteditable="true" class="command"></span><span class="pulse">_</span></pre></div>') ;
        }
        plugin.initPromptHandlers = function(){
            var newPrompt = plugin.createPrompt();
            plugin.prompt.replaceWith(newPrompt);
            plugin.prompt = newPrompt;
            plugin.getPromptInput().keypress(plugin.promptKeyPress);
            plugin.getPromptInput().keydown(plugin.promptKeyDown);
            plugin.getPromptInput().keydown(plugin.promptCTRL_L);
        }
        plugin.deinitPromptHandlers = function(){
            plugin.getPromptInput().off('keypress',plugin.promptKeyPress);
            plugin.getPromptInput().off('keydown',plugin.promptKeyDown);
            plugin.getPromptInput().off('keydown',plugin.promptCTRL_L);
        }
        plugin.promptCTRL_C = function(e){
            if (e.keyCode == 67 && e.ctrlKey) {
                plugin.function.exit();
            }
        }
        plugin.promptCTRL_L = function(e){
            if (e.keyCode == 76 && e.ctrlKey) {
                e.preventDefault();
                if(plugin.autoexit){
                    plugin.clear();
                    plugin.focusPrompt();
                }
            }
        }
        plugin.promptKeyPress = function(e){
            if (e.keyCode == 13) {
                e.preventDefault();                
                plugin.launch(plugin.getPromptInput().text());

            }
        }
        plugin.promptKeyDown = function(e){
            if(e.keyCode == 38){
                e.preventDefault();
                if(history.index > 0){
                    history.index -= 1;
                }
                plugin.setPrompt(history.commands[history.index]);
                plugin.focusPrompt();
            }
            if(e.keyCode == 40){
                e.preventDefault();
                if(history.index < history.commands.length){
                    history.index += 1;
                }
                plugin.setPrompt(history.commands[history.index]);
                plugin.focusPrompt();
            }
        }
        plugin.focusPrompt = function(){
            plugin.getPromptInput().focus();
            var textNode =  plugin.getPromptInput()[0].firstChild;
            if(textNode != undefined){
                var caret = textNode.length;
                var range = document.createRange();
                range.setStart(textNode, caret);
                range.setEnd(textNode, caret);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        plugin.getPromptInput = function(){
            return plugin.prompt.find('.command');
        }
        plugin.showPrompt = function(isCommand){
            plugin.emptyPrompt();
            plugin.prompt.show();
            if(isCommand == undefined){
                plugin.prompt.find('.dollar').show();
            }else{
                plugin.prompt.find('.dollar').hide();
            }
        }
        plugin.emptyPrompt = function(){
            plugin.getPromptInput().empty();
        }
        plugin.hidePrompt = function(){
            plugin.prompt.hide();
        }
        plugin.setPrompt = function(text){
            plugin.getPromptInput().text(text);
        }
        plugin.promptBottom = function(){
            setTimeout( function() {
                $($el).scrollTop($el[0].scrollHeight);
            }, 1 );
        }
        plugin.clear = function(){
            $el.find('.line').not('.prompt').remove();
        }
        plugin.clearLastLine = function(){
            $el.find('.line').not('.prompt').not('.command').last().remove();
        }
        /*
         * Creation of line
         */
        plugin.createLine = function(content, color){
            if(color){
                return $('<div class="line" style="text-shadow: 0 0 0 '+color+ '"><pre>'+content+'</pre></div>');
            }
            return $('<div class="line"><pre>'+content+'</pre></div>');
        }
        plugin.createCommandLine = function(command){
            var prefix = '';
            if(plugin.options.promptUser){
                var user = plugin.options.promptUser;
                prefix = user;
            }
            if(plugin.options.promptDir){
                var dir = plugin.options.promptDir;
                if(plugin.options.promptUser){
                    prefix = user+'@'+dir;
                }else{
                    prefix = dir;
                }
                
            }
            return $('<div class="line command"><pre><span class="dollar">'+prefix+plugin.options.prompt+' </span><span class="command">'+command+'</span></pre></div>');
        }
        plugin.createErrorLine = function(content){
            return $('<div class="line error"><pre>'+content+'</pre></div>');
        }
        /*
         * Execution
         */
        plugin.launch = function(text){
            plugin.hidePrompt();
            history.commands.push(text);
            history.index = history.commands.length;
            var tab = text.split(" ");
            var command = tab.shift();
            var parameters = tab;
            plugin.createCommandLine(text).insertBefore(plugin.prompt);
            var prog = plugin.eval(command);
            if(prog){
                plugin.execute(prog.program,parameters); 
            }else{
                plugin.showPrompt();
                plugin.deinitPromptHandlers();
                plugin.initPromptHandlers();
                plugin.focusPrompt();
            }
        }
        plugin.execute = function(program,parameters){
            plugin.getPromptInput().keydown(plugin.promptCTRL_C);
            program(plugin.function, parameters);
            if(plugin.autoexit){
               plugin.function.exit();
            }

            plugin.promptBottom(); 
        }
        plugin.executeCallback = function(callback){
            plugin.getPromptInput().keydown(plugin.promptCTRL_C);
            callback(plugin.function);
            if(plugin.autoexit){
               plugin.function.exit();
            }

            plugin.promptBottom(); 
        }
        plugin.eval =  function(command){
            var prog = plugin.options.prog.find(prog => {
                return prog.command == command;
            })
            if(prog != undefined){
                return prog;
            }else{
                plugin.function.err("Command &lt;" + command + "&gt; not found");
                return false;
            }
        }
        plugin.init();
    };
    $.fn.terminal = function(arg) {
        /*
        if (typeof myVar === 'string' || myVar instanceof String){
            return {
                prompt : function(){
                    return $(this);
                }
            }
        }else{
            return this.each(function() {    
                if ($(this).attr('upgraded') == undefined) {              
                    var plugin = new $.terminal(this, options);
                    $(this).attr('upgraded', 'true');
                }
            });
        }
        */




        var pluginName = 'terminal';

        var args, instance;

        // only allow the plugin to be instantiated once
        if (!( this.data( 'plugin_' + pluginName ) instanceof Terminal )) {

            // if no instance, create one
            this.data( 'plugin_' + pluginName, new Terminal( this, arg ) );
        }

        instance = this.data( 'plugin_' + pluginName );

        /*
        * because this boilerplate support multiple elements
        * using same Plugin instance, so element should set here
        */
        instance.element = this;

        // Is the first parameter an object (arg), or was omitted,
        // call Plugin.init( arg )
        if (typeof arg === 'undefined' || typeof arg === 'object') {
            if(arg.method ){
                if(typeof arg.method === 'string' && typeof instance[arg.method] === 'function'){
                    if(arg.callback && arg.callback.constructor && arg.callback.call && arg.callback.apply){
                        instance[arg.method](arg.callback );
                    }
                }
            }else{
                return $(this);
            }
            

        // checks that the requested public method exists
        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {

            console.log(arg);
            // copy arguments & remove function name
            args = Array.prototype.slice.call( args, 1 );

            // call the method
            return instance[arg].apply( instance, args );

        } else {
            console.log(arg);
            console.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

        }
    } 
}( jQuery ));