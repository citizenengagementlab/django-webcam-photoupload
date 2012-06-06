window.addEventListener("load", function() {

	$("body").append("<div id=\"flash\"></div>");

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
}, false);


var addToCanvas = function(text) {
	ctx.fillStyle = "#000";
	ctx.font = "40px Helvetica";
	ctx.globalAlpha=1;
	ctx.fillText(text, 40,80)
}