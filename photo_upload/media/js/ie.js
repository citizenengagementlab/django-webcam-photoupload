$(document).ready(function() {

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

});