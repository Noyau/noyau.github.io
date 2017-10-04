function GUI() {}

GUI.strokeText = function(context, x, y, text, font = "2em Arial", strokeStyle = "#afaffa", textAlign = "left") {
    context.font = font;
    context.textAlign = textAlign;
    context.strokeStyle = strokeStyle;
    context.strokeText(text, x, y);
}