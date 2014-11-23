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
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n';

    var parser = new Parser();
    parser.blockMode = true;
    parser.parse(testlevel);
    console.log(parser.levels);

    var mainState = createWorld(parser.levels);
    gamvas.state.addState(new mainState('game'));
    gamvas.state.addState(new pauseState('pause'));
    gamvas.start('gameCanvas', true);
    gamvas.state.setState('game');
});

gamvas.config.preventKeyEvents = true;

function fileSelected(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
        var parser = new Parser();
        parser.parse(reader.result);
        console.log(parser.levels);

        var mainState = createWorld(parser.levels);
        gamvas.state.addState(new mainState('game'));
		gamvas.state.addState(new pauseState('pause'));
        gamvas.start('gameCanvas', true);
		gamvas.state.setState('game');
    };

    reader.readAsText(file);
}

