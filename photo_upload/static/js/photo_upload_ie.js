



$(document).ready(function() {

//forEach is now supported!
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope || this, this[i], i, this);
    }
  }
}
      
//upload raw file
var uploader = new qq.FileUploader({
	element: document.getElementById('file-uploader'),
	action: 'upload_raw_photo',
	onComplete: function(id, fileName, responseJSON) {
		console.log(responseJSON);

        switchStep();
        $('#id_raw_photo_pk').val(responseJSON.raw_photo_pk);
        $('#id_raw_photo_url').val(responseJSON.file_url);

        //draw image to canvas
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        drawPhoto(context,responseJSON.file_url);
	}
});

//upload form
 




});