gamvas.config.preventKeyEvents = false;
game = new mainState('game');

var samplelevel = '{\n\
"H": "player",\n\
"M": "obstacle",\n\
"!": "danger",\n\
"E": "enemy",\n\
"o": "collectible",\n\
"Y": "goal"\n\
}\n\
\n\
BEGINLEVEL\n\
\n\
\n\
H                                    oooo\n\
MMMMMMMMMM!!!!!!!!!MMMMMMMMM         MMMM\n\
\n\
\n\
\n\
    o                  E\n\
    o   MMMMMMMMM!!!MMMMMMMMMMMMMMMMM!!!!\n\
    o\n\
    o          oo    ooo\n\
   MMMM        MM    MMM\n\
\n\
                 E\n\
!!!!!!!MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM  M\n\
\n\
   Y       MMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n\
MMMMMMMMMMM\n\
\n\
\n\
\n\
BEGINLEVEL\n\
\n\
     oo          E      M\n\
     oo       watchit!  M\n\
     oo                 M             !\n\
     oo                 !             !\n\
     oo                               !\n\
     UP                               M\n\
                                      Moo\n\
                        M             Moo\n\
                        M             CoW\n\
                   Way  M             MMMMMM\n\
                        M\n\
                        M             MMMMM\n\
                  ^     M                 oM      MMMM\n\
                        M             MMMMM\n\
            this        M                 !M\n\
                        M             MMMMM\n\
                        M                 oM             M\n\
o      H                M   Pillow    MMMMM         E    M\n\
MMMMMMMMMMMMM!!!!MMMMMMMMMMM!!!!!!MMMM Y      MMMMMMMMMMMM\n\
                                      MMMMMMMM\n\
\n\
    E     E      E       E       E      E      E\n\
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n\
\n\
\n\
\n\
BEGINLEVEL\n\
\n\
\n\
\n\
H\n\
MMMMM             MMMMMMMMMMMMMMMMMM  MMMMMMMM             MMMMMMMMMMMM\n\
                                                                      M\n\
                                     M                                M\n\
                    ooo        E                                      MMMM\n\
                 M  MMM    MMMMMMMMM                                     M\n\
                                                                         M\n\
                                                                     M\n\
                                                        !  o  !\n\
                                                       ! ! M ! !  M   !\n\
                                                      !   ! !   !     !\n\
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     !     !!!!!!!!MMMMMMM\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
                                                                                                                                        !thanks for plaYing!\n\
o                                                                                                E                      E\n\
M            M               M               M     adrenaline      MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\
\n\
\n';

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
    document.getElementById('textInput').value = samplelevel;
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