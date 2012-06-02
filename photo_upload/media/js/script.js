$("document").ready(function() {
	$("#camera").webcam({
	        width: 320,
	        height: 240,
	        mode: "callback",
	        swffile: "{{STATIC_URL}}js/jscam.swf",
	        onTick: function() {},
	        onSave: function() {},
	        onCapture: function() {},
	        debug: function() {},
	        onLoad: function() {}
	});
});