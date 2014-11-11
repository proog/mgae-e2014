function indexToPosition(row, col){
    var dimensions = gamvas.getCanvasDimension();
    var offsetx = dimensions.w / 2;
    var offsety = dimensions.h / 2;

    return {"x": Common.tileSize.width * col - offsetx, "y": Common.tileSize.height * row - offsety};
}
