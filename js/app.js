gamvas.event.addOnLoad(function() {
    var testlevel = '{\
"G": "player",\n\
"f": "obstacle",\n\
"y": "danger",\n\
"e": "enemy"\n\
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
\n\
\n\
\n\
\n\
      cool  platforms  dood  ffffffff     ffffff    ff     ffffffff\
\n\
\n\
\n\
   G                   e             T\n\
ffffffffff  yyy  fffffffffffffffffffffffffffffffffffffffff\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n';

    var parser = new Parser();
    parser.parse(testlevel);
    console.log(parser.objects);
    console.log(parser.world);

    var mainState = createWorld(parser.world, parser.objects);
    gamvas.state.addState(new mainState('mainGame'));
    gamvas.start('gameCanvas', true);
});

gamvas.config.preventKeyEvents = true;

function fileSelected(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
        var parser = new Parser();
        parser.parse(reader.result);
        console.log(parser.objects);
        console.log(parser.world);

        var mainState = createWorld(parser.world, parser.objects);
        gamvas.state.addState(new mainState('mainGame'));
        gamvas.start('gameCanvas', true);
    };

    reader.readAsText(file);
}

