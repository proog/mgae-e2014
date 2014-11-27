gamvas.config.preventKeyEvents = false;
game = new mainState('game');

gamvas.event.addOnLoad(function() {
    var testlevel = '{\n\
    "H": "player",\n\
    "^": "danger",\n\
    "~": "enemy",\n\
    "*": "collectible",\n\
    "¤": "goal"\n\
}\n\
\n\
BEGINLEVEL\n\
\n\
        Welcome to Monospace Hero!\n\
        ||||||||||||||||||||||||||\n\
\n\
           A tool developed by\n\
             Per Mortensen &\n\
          Jacob Romme Rasmussen\n\
\n\
****************************************  ¤\n\
Arrow keys to MOVE - Space to (DOUBLE) JUMP\n\
\n\
    Load a text file to the right or\n\
   start your adventure in the text box!\n\
\n\
Made possible thanks to the Gamvas framework\n\
\n\
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n\
\n\
       ~            ~             ~\n\
--------------------------------------------\n\
\n';

    document.getElementById('textInput').value = testlevel;
    parseAndStartGame(testlevel);
});

function fileSelected(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
        document.getElementById('textInput').value = reader.result;
        parseAndStartGame(reader.result);
    };

    reader.readAsText(file);
}

function runThis() {
    var str = document.getElementById('textInput').value;
    parseAndStartGame(str);
}

function trySample() {
    document.getElementById('textInput').value = testlevel2;
    runThis();
}

function parseAndStartGame(str) {
    var parser = new Parser();
    try {
        parser.parse(str);
    } catch(e) {
        alert(e);
        return;
    }

    console.log(parser.levels);

    // clear file input
    var input = document.getElementById('fileInput');
    try {
        input.value = '';
        if(input.value) {
            input.type = "text";
            input.type = "file";
        }
    } catch(e) {}

    document.getElementById('gameCanvas').focus();
    document.getElementById('gameCanvas').blur();

    if(!gamvas.state.getState('game')) {
        // gamvas has not been loaded yet
        game.loadGame(parser.levels);
        gamvas.state.addState(game);
        gamvas.state.addState(new pauseState('pause'));
        gamvas.start('gameCanvas', true);
        gamvas.state.setState('game');
    }
    else {
        // gamvas is already running and we're loading a new file
        gamvas.state.setState('game');
        game.loadGame(parser.levels);
        game.init();
    }
}