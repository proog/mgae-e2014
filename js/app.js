gamvas.event.addOnLoad(function() {
    var testlevel = '{\
"=": "player",\n\
"f": "obstacle",\n\
"y": "danger",\n\
"M": "enemy"\n\
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
               M                                    T\n\
      cool platforms  dood  ffffffff     ffffff    ff     ffffffff\n\
\n\
cc\n\
\n\
   cc\n\
   =                   M             \n\
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
  =\n\
\n\
\n\
\n\
                M          T\n\
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
        gamvas.state.addState(new mainState('mainGame'));
        gamvas.start('gameCanvas', true);
    };

    reader.readAsText(file);
}

