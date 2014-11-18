function getObjectWorldPosition(object) {
    return {
        x: object.position.col * Common.tileSize.width + object.size.width * Common.tileSize.width / 2,
        y: object.position.row * Common.tileSize.height + object.size.height * Common.tileSize.height / 2
    };
}