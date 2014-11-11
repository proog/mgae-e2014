gamvas.event.addOnLoad(function() {

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
        gamvas.start('gameCanvas');
    };

    reader.readAsText(file);
}
