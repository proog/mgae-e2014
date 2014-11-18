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
    this.ignoredCharacters = [
        ' ',
        '\r',
        '\n',
        '\t'
    ];

    this.makeObject = function(symbol, col, row, role, width, height) {
        return {
            symbol: symbol,
            role: role,
            position: {
                col: col,
                row: row
            },
            size: {
                width: width,
                height: height
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
            var currentBlock = {
                char: null,
                role: null,
                length: 0,
                start: 0,
                row: 0
            };

            for(var col = 0; col < line.length; col++) {
                var char = line[col].toString();

                // fallback to default defs if not found in user-defined
                var textRole = defs[char] ? defs[char].toLowerCase() : this.defaultDefinitions[char];
                var role = this.textRoles[textRole] ? this.textRoles[textRole] : Common.roles.OBSTACLE;

                if(char == currentBlock.char) {
                    // same symbol, extend current block
                    currentBlock.length++;
                }
                else {
                    // new symbol encountered, make the block, but only if it's not an ignored character
                    if(currentBlock.length > 0 && this.ignoredCharacters.indexOf(currentBlock.char) < 0) {
                        var object = this.makeObject(currentBlock.char, currentBlock.start, currentBlock.row, currentBlock.role, currentBlock.length, 1);
                        this.objects.push(object);
                    }

                    // reset current block to this symbol
                    currentBlock.char = char;
                    currentBlock.role = role;
                    currentBlock.length = 1;
                    currentBlock.start = col;
                    currentBlock.row = row;
                }

                // extend world width
                if(col > this.world.width)
                    this.world.width = col;
            }

            // extra check for the last block on a line
            if(currentBlock.length > 0 && this.ignoredCharacters.indexOf(currentBlock.char) < 0) {
                var object = this.makeObject(currentBlock.char, currentBlock.start, currentBlock.row, currentBlock.role, currentBlock.length, 1);
                this.objects.push(object);
            }
        }

        return this.objects;
    };
}
