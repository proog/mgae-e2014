gamvas.config.preventKeyEvents = true;
game = new mainState('game');

gamvas.event.addOnLoad(function() {


    //return;
    var testlevel = '{\
"G": "player",\n\
"f": "obstacle",\n\
"y": "danger",\n\
"e": "enemy",\n\
"b": "collectible"\n\
}\n\
\n\
BEGINLEVEL\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
             e   e           b            bb       T\n\
      cool platforms  dood  ffffffff     ffffff    ff     ffffffff\n\
\n\
cc\n\
\n\
   cc\n\
    G                   e                 bbbbbbbb \n\
	ffffffffff yyy fffffffffffffffffffffffffffffffffffffffff\n\
\n\
\n\
\n\
BEGINLEVEL\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
  G\n\
\n\
\n\
\n\
                e          T\n\
             fffffff    goal!\n\
\n\
   \n\
ffffff  hi! jkljkffffffffffffffffffffljkl\n\
\n';

    var parser = new Parser();
    parser.parse(testlevel);
    startGame(parser.levels);
});

function fileSelected(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
        var parser = new Parser();
        parser.parse(reader.result);
        startGame(parser.levels);
    };

    reader.readAsText(file);
}

function startGame(levels) {
    console.log(levels);

    if(!gamvas.state.getState('game')) {
        // gamvas has not been loaded yet
        game.loadGame(levels);
        gamvas.state.addState(game);
        gamvas.state.addState(new pauseState('pause'));
        gamvas.start('gameCanvas', true);
        gamvas.state.setState('game');
    }
    else {
        // gamvas is already running and we're loading a new file
        game.loadGame(levels);
        game.init();
    }
}

function clicked() {
    var str = document.getElementById('textInput').value;
    var parser = new Parser();
    parser.parse(str);
    startGame(parser.levels);
}