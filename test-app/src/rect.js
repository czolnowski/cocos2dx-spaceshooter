var Rect = function(x1, y1, width, height) {
    this.x = x1;
    this.y = y1;
    this.width = width;
    this.height = height;
};

Rect.RectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

Rect.RectGetMinX = function (rect) {
    return rect.x;
};

Rect.RectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

Rect.RectGetMinY = function (rect) {
    return rect.y;
};

Rect.isIntersect = function(rectA, rectB) {
    return !(Rect.RectGetMaxX(rectA) < Rect.RectGetMinX(rectB) ||
         Rect.RectGetMaxX(rectB) < Rect.RectGetMinX(rectA) ||
         Rect.RectGetMaxY(rectA) < Rect.RectGetMinY(rectB) ||
         Rect.RectGetMaxY(rectB) < Rect.RectGetMinY(rectA));
};

Rect.containsPoint = function (rect, point) {
    var ret = false;
    if (point.x >= Rect.RectGetMinX(rect) && point.x <= Rect.RectGetMaxX(rect) &&
        point.y >= Rect.RectGetMinY(rect) && point.y <= Rect.RectGetMaxY(rect)) {
        ret = true;
    }
    return ret;
};
