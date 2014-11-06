function Parser() {
    this.objects = [];
    this.world = {
        width: 0,
        height: 0
    };
    this.definitions = [];
    this.separator = '\nBEGINLEVEL';
    this.textRoles = {
        'player': Common.roles.PLAYER,
        'obstacle': Common.roles.OBSTACLE,
        'danger': Common.roles.DANGER,
        'goal': Common.roles.GOAL,
        'enemy': Common.roles.ENEMY,
        'collectible': Common.roles.COLLECTIBLE,
        'passive:': Common.roles.PASSIVE
    };
    this.defaultDefinitions = {
        S: 'player',
        g: 'obstacle',
        T: 'goal',
        '!': 'danger',
        E: 'enemy'
    };

    this.makeObject = function(symbol, col, row, role) {
        return {
            symbol: symbol,
            role: role,
            position: {
                col: col,
                row: row
            },
            size: {
                x: 1,
                y: 1
            }
        };
    };

    this.parse = function (str) {
        var split = str.split(this.separator);

        if(split.length != 2) {
            return;
        }

        this.parseDefinitions(split[0]);
        this.parseLevel(split[1], this.definitions);
    };

    this.parseDefinitions = function (str) {
        this.definitions = JSON.parse(str);
        return this.definitions;
    };

    this.parseLevel = function (str, defs) {
        var lines = str.split('\n');
        this.objects = [];

        for(var row = 0; row < lines.length; row++) {
            this.world.height = row;

            var line = lines[row];

            for(var col = 0; col < line.length; col++) {
                var char = line[col].toString();

                // ignore whitespace
                if(char == ' ')
                    continue;

                // fallback to default defs if not found in user-defined
                var textRole = defs[char] ? defs[char].toLowerCase() : this.defaultDefinitions[char];

                var role = this.textRoles[textRole] ? this.textRoles[textRole] : Common.roles.PASSIVE;
                var object = this.makeObject(char, col, row, role);
                this.objects.push(object);

                if(col > this.world.width)
                    this.world.width = col;
            }
        }

        return this.objects;
    };
}

function fileSelected(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
        var parser = new Parser();
        parser.parse(reader.result);
        console.log(parser.objects);
        console.log(parser.world);
    };

    reader.readAsText(file);
}

function init() {
    document.getElementById('fileInput').addEventListener('change', fileSelected, false);
}
